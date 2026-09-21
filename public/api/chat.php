<?php
/**
 * Same-origin proxy between the portfolio and the CV agent on Cloud Run.
 *
 * The agent has no CORS and sits behind a Bearer key, so the browser cannot
 * call it directly. This file runs on the portfolio's own host: the page talks
 * to its own origin, and the key never leaves the server.
 *
 * The agent has no rate limiting of its own, and every request costs a model
 * call, so the limits live here. No message text is ever logged or stored --
 * only counters.
 */
declare(strict_types=1);

const MAX_BODY_BYTES      = 65536;
const MAX_MESSAGES        = 20;     // 10 turns: user + assistant each
const MAX_USER_CHARS      = 6000;   // room to paste a job description
const MAX_ASSISTANT_CHARS = 12000;
const IP_LIMIT            = 20;     // requests per window, per client
const IP_WINDOW_SECONDS   = 600;
const DAILY_LIMIT         = 400;    // hard ceiling on spend, all clients
const ALLOWED_HOSTS       = ['edherivan.com', 'www.edherivan.com'];

function fail(int $status, string $code, string $message): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode(['error' => ['code' => $code, 'message' => $message]]);
    exit;
}

// display_errors is off on the host, so an uncaught error would be a blank
// 500 the page cannot explain. Turn it into the same JSON shape as any other
// failure -- without the detail, which is not the visitor's business.
set_exception_handler(static function (Throwable $e): void {
    if (!headers_sent()) {
        fail(500, 'internal_error', 'The assistant hit an internal error. Try again later.');
    }
});

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    fail(405, 'method_not_allowed', 'Use POST.');
}

// Browsers always send Origin on a cross-site POST. Anything claiming to come
// from another site is turned away; the rate limits cover the rest.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $host = parse_url($origin, PHP_URL_HOST);
    if (!in_array($host, ALLOWED_HOSTS, true)) {
        fail(403, 'forbidden_origin', 'This endpoint only serves edherivan.com.');
    }
}

// Two levels up from public_html/api: outside the web root, so the key is
// never reachable over HTTP and a deploy of public_html does not touch it.
$base = dirname(__DIR__, 2);
$configPath = $base . '/cv-agent-config.php';
if (!is_file($configPath)) {
    fail(503, 'not_configured', 'The assistant is not available right now.');
}
$config = require $configPath;
$agentUrl = rtrim((string)($config['agent_url'] ?? ''), '/');
$agentKey = (string)($config['agent_key'] ?? '');
if ($agentUrl === '' || $agentKey === '') {
    fail(503, 'not_configured', 'The assistant is not available right now.');
}

// --- Input ------------------------------------------------------------------

$raw = file_get_contents('php://input', false, null, 0, MAX_BODY_BYTES + 1);
if ($raw === false || strlen($raw) > MAX_BODY_BYTES) {
    fail(413, 'too_large', 'That message is too long.');
}
$payload = json_decode($raw, true);
if (!is_array($payload) || !isset($payload['messages']) || !is_array($payload['messages'])) {
    fail(400, 'invalid_request', 'Expected {"messages": [...]}.');
}

$messages = $payload['messages'];
$count = count($messages);
if ($count < 1) {
    fail(400, 'invalid_request', 'No messages.');
}
if ($count > MAX_MESSAGES) {
    fail(400, 'conversation_too_long', 'This conversation reached its limit. Start a new one.');
}

$input = [];
foreach ($messages as $m) {
    if (!is_array($m) || !isset($m['role'], $m['content']) || !is_string($m['content'])) {
        fail(400, 'invalid_request', 'Each message needs a role and text content.');
    }
    $role = $m['role'];
    if ($role !== 'user' && $role !== 'assistant') {
        fail(400, 'invalid_request', 'Unknown role.');
    }
    $text = trim($m['content']);
    if ($text === '') {
        fail(400, 'invalid_request', 'Empty message.');
    }
    $limit = $role === 'user' ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS;
    if (mb_strlen($text, 'UTF-8') > $limit) {
        fail(413, 'too_large', 'That message is too long.');
    }
    $input[] = ['type' => 'message', 'role' => $role, 'content' => $text];
}
if ($input[$count - 1]['role'] !== 'user') {
    fail(400, 'invalid_request', 'The last message must come from the user.');
}

// --- Rate limits --------------------------------------------------------------

$dataDir = $base . '/cv-agent-data';
if (!is_dir($dataDir) && !@mkdir($dataDir, 0700, true)) {
    fail(503, 'not_configured', 'The assistant is not available right now.');
}

/**
 * Sliding-window counter in a locked file. Returns false once the limit is hit.
 */
function allow(string $file, int $limit, int $window): bool
{
    $fh = @fopen($file, 'c+');
    if ($fh === false) {
        return false; // fail closed: an unwritable store must not mean unlimited
    }
    flock($fh, LOCK_EX);
    $now = time();
    $stamps = json_decode((string)stream_get_contents($fh), true);
    $stamps = is_array($stamps) ? array_values(array_filter(
        $stamps,
        static fn($t) => is_int($t) && $t > $now - $window
    )) : [];
    $ok = count($stamps) < $limit;
    if ($ok) {
        $stamps[] = $now;
    }
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($stamps));
    flock($fh, LOCK_UN);
    fclose($fh);
    return $ok;
}

// Behind a CDN REMOTE_ADDR can be shared by many visitors, so the forwarded
// hop is mixed in. That header can be spoofed to dodge the per-client limit;
// the daily ceiling below is what actually bounds the spend.
$client = ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . '|' .
    trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '')[0]);
$clientFile = $dataDir . '/ip-' . hash('sha256', $client) . '.json';

if (!allow($clientFile, IP_LIMIT, IP_WINDOW_SECONDS)) {
    header('Retry-After: ' . IP_WINDOW_SECONDS);
    fail(429, 'rate_limited', 'Too many questions in a short time. Try again in a few minutes.');
}
if (!allow($dataDir . '/daily.json', DAILY_LIMIT, 86400)) {
    fail(429, 'daily_limit', 'The assistant reached its daily limit. Try again tomorrow.');
}

// Old per-client files are swept occasionally so the directory stays small.
if (random_int(1, 50) === 1) {
    foreach (glob($dataDir . '/ip-*.json') ?: [] as $f) {
        if (@filemtime($f) < time() - 86400) {
            @unlink($f);
        }
    }
}

// --- Forward, streaming -------------------------------------------------------

@set_time_limit(150);
@ini_set('zlib.output_compression', '0');
@ini_set('output_buffering', '0');
while (ob_get_level() > 0) {
    ob_end_flush();
}
// No argument on purpose: the parameter is an int in PHP 7 and a bool in
// PHP 8, and under strict_types the wrong one is a fatal TypeError.
ob_implicit_flush();

$status = 0;
$started = false;

$ch = curl_init($agentUrl . '/v1/responses');
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode(['input' => $input, 'stream' => true]),
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Accept: text/event-stream',
        'Authorization: Bearer ' . $agentKey,
    ],
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT        => 120,
    CURLOPT_HEADERFUNCTION => static function ($ch, string $line) use (&$status): int {
        if (preg_match('#^HTTP/\S+\s+(\d{3})#', $line, $m)) {
            $status = (int)$m[1];
        }
        return strlen($line);
    },
    CURLOPT_WRITEFUNCTION  => static function ($ch, string $chunk) use (&$status, &$started): int {
        if ($status !== 200) {
            // Upstream error bodies are dropped, never relayed: they may carry
            // detail that is nobody else's business. The status is enough.
            return strlen($chunk);
        }
        if (!$started) {
            $started = true;
            header('Content-Type: text/event-stream; charset=utf-8');
            header('Cache-Control: no-cache, no-store');
            header('X-Accel-Buffering: no');
            header('Content-Encoding: none');
        }
        echo $chunk;
        flush();
        return strlen($chunk);
    },
]);

$ok = curl_exec($ch);
curl_close($ch);

if ($started) {
    exit; // the stream already went out, whatever happened after
}
if ($ok === false || $status === 0) {
    fail(502, 'upstream_unreachable', 'The assistant did not respond. Try again in a moment.');
}
if ($status === 401 || $status === 403) {
    fail(503, 'not_configured', 'The assistant is not available right now.');
}
if ($status === 429) {
    fail(429, 'rate_limited', 'The assistant is busy. Try again in a moment.');
}
fail(502, 'upstream_error', 'The assistant could not answer that. Try again.');

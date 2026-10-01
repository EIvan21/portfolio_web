<?php
/**
 * Latest TikTok videos for the AI video section, served from a server cache.
 *
 * TikTok's creator-profile embed sheds load ("overload-protect", 503/429) for
 * minutes at a time, for any account, and a page cannot detect that inside a
 * cross-origin iframe -- visitors just saw TikTok's error text. So the page no
 * longer embeds it:
 *
 *  - The list of video IDs is read from that same profile embed, here on the
 *    server, and kept. When TikTok refuses, the last good list is reused.
 *  - Titles and thumbnails come from oEmbed, which stays up, so they keep
 *    refreshing even while the profile embed is down. Thumbnail URLs are signed
 *    and expire after ~48 h, which is why the cache is refreshed hourly.
 *
 * Runs on PHP 7.4: no PHP 8-only functions.
 */
declare(strict_types=1);

const HANDLE        = '_brownai_';
const MAX_VIDEOS    = 8;
const MAX_CANDIDATE = 20;
const FRESH_SECONDS = 3600;
const USER_AGENT    = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                    . '(KHTML, like Gecko) Chrome/128.0 Safari/537.36';

function send_json(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    // Browsers and the host cache may keep it a few minutes; the hourly
    // refresh lives on the server, not in every visitor's browser.
    header('Cache-Control: public, max-age=300');
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

set_exception_handler(static function (Throwable $e): void {
    if (!headers_sent()) {
        send_json(500, ['error' => 'internal_error']);
    }
});

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    header('Allow: GET');
    send_json(405, ['error' => 'method_not_allowed']);
    exit;
}

// Outside public_html, next to the chat proxy's config: never served over HTTP
// and untouched by a site deploy.
$cacheDir = dirname(__DIR__, 2) . '/site-cache';
$cacheFile = $cacheDir . '/tiktok-' . HANDLE . '.json';
if (!is_dir($cacheDir)) {
    @mkdir($cacheDir, 0700, true);
}

$cache = null;
if (is_file($cacheFile)) {
    $decoded = json_decode((string)file_get_contents($cacheFile), true);
    if (is_array($decoded) && !empty($decoded['videos'])) {
        $cache = $decoded;
    }
}

if ($cache !== null && time() - (int)$cache['fetched_at'] < FRESH_SECONDS) {
    send_json(200, $cache);
    exit;
}

// Stale or missing. With a stale copy, answer right away and refresh after the
// response is out, when the host allows finishing the request early.
$answered = false;
if ($cache !== null && (function_exists('litespeed_finish_request') || function_exists('fastcgi_finish_request'))) {
    send_json(200, $cache + ['stale' => true]);
    function_exists('litespeed_finish_request') ? litespeed_finish_request() : fastcgi_finish_request();
    $answered = true;
}

// Only one request refreshes at a time; the rest keep serving the copy.
$lock = @fopen($cacheFile . '.lock', 'c');
if ($lock === false || !flock($lock, LOCK_EX | LOCK_NB)) {
    if (!$answered) {
        $cache !== null
            ? send_json(200, $cache + ['stale' => true])
            : send_json(503, ['error' => 'warming_up']);
    }
    exit;
}

/** @return array{0:int,1:string} */
function http_get(string $url, int $timeout): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT        => $timeout,
        CURLOPT_USERAGENT      => USER_AGENT,
        CURLOPT_ENCODING       => '',
    ]);
    $body = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$status, is_string($body) ? $body : ''];
}

/** IDs from the profile embed, or null when TikTok refuses. */
function profile_ids(): ?array
{
    [$status, $html] = http_get('https://www.tiktok.com/embed/@' . HANDLE, 10);
    if ($status !== 200 || $html === '') {
        return null;
    }
    // Video IDs are 19-digit snowflakes. The page also carries other numbers
    // of that size (the account's own ID), so these are only candidates:
    // oEmbed confirms which ones are this account's videos.
    preg_match_all('/(?<!\d)\d{19}(?!\d)/', $html, $m);
    $ids = array_values(array_unique($m[0]));
    return $ids ?: null;
}

/** Title and thumbnail per ID, kept only when oEmbed confirms the author. */
function oembed_many(array $ids): array
{
    $multi = curl_multi_init();
    $handles = [];
    foreach ($ids as $id) {
        $video = 'https://www.tiktok.com/@' . HANDLE . '/video/' . $id;
        $ch = curl_init('https://www.tiktok.com/oembed?url=' . rawurlencode($video));
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_USERAGENT      => USER_AGENT,
        ]);
        curl_multi_add_handle($multi, $ch);
        $handles[$id] = $ch;
    }
    do {
        $status = curl_multi_exec($multi, $running);
        if ($running) {
            curl_multi_select($multi, 1.0);
        }
    } while ($running && $status === CURLM_OK);

    $out = [];
    $suffix = strtolower('/@' . HANDLE);
    foreach ($handles as $id => $ch) {
        $data = json_decode((string)curl_multi_getcontent($ch), true);
        curl_multi_remove_handle($multi, $ch);
        curl_close($ch);
        if (!is_array($data) || empty($data['thumbnail_url'])) {
            continue;
        }
        $author = strtolower(rtrim((string)($data['author_url'] ?? ''), '/'));
        if (substr($author, -strlen($suffix)) !== $suffix) {
            continue;
        }
        $out[(string)$id] = [
            'id'        => (string)$id,
            'title'     => (string)($data['title'] ?? ''),
            'thumbnail' => (string)$data['thumbnail_url'],
        ];
    }
    curl_multi_close($multi);
    return $out;
}

$ids = profile_ids();
$listRefreshed = $ids !== null;
if ($ids === null) {
    // Profile embed is down: keep the last known list, refresh its metadata.
    $ids = $cache !== null ? array_column($cache['videos'], 'id') : [];
}
$ids = array_slice($ids, 0, MAX_CANDIDATE);
$meta = $ids ? oembed_many($ids) : [];

// Snowflake IDs grow with time, so a descending sort is newest first. Same
// length strings compare correctly without needing 64-bit integers.
$videos = array_values($meta);
usort($videos, static function (array $a, array $b): int {
    return strcmp($b['id'], $a['id']);
});
$videos = array_slice($videos, 0, MAX_VIDEOS);

if ($videos) {
    $fresh = [
        'handle'          => HANDLE,
        'videos'          => $videos,
        'fetched_at'      => time(),
        'list_checked_at' => $listRefreshed ? time() : (int)($cache['list_checked_at'] ?? 0),
    ];
    $tmp = $cacheFile . '.tmp';
    if (@file_put_contents($tmp, json_encode($fresh, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)) !== false) {
        @rename($tmp, $cacheFile);
    }
    $cache = $fresh;
}

flock($lock, LOCK_UN);
fclose($lock);

if (!$answered) {
    $cache !== null
        ? send_json(200, $cache)
        : send_json(503, ['error' => 'unavailable']);
}

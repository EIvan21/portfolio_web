import { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './AskCv.css';

const ENDPOINT = '/api/chat.php';

// Mirrors the proxy's limits so the visitor hears about them before the
// server has to say no.
const MAX_USER_TURNS = 10;
const MAX_CHARS = 6000;

// Each one shows a different side of the agent. The Kubernetes one is on
// purpose: it shows the agent saying "that's not in the CV" instead of bluffing.
const SUGGESTIONS = [
  'What is his experience with LLM agents?',
  'Tell me about his most challenging project',
  'I have a job description — how well does he fit?',
  'Does he have experience with Kubernetes?',
  'What kind of role is he looking for?',
];

const IS_DEV = process.env.NODE_ENV === 'development';

// The dev server cannot run PHP, so local review gets a canned stream.
async function* mockStream() {
  const text =
    '**Local preview.** The real agent answers in production, where the PHP ' +
    'proxy runs.\n\n- Answers stream in like this\n- Lists and **bold** render\n' +
    '- `inline code` too';
  for (const word of text.split(/(?<=\s)/)) {
    await new Promise((r) => setTimeout(r, 35));
    yield word;
  }
}

// Reads the agent's Open Responses SSE stream and yields text deltas.
async function* readDeltas(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    // Normalised on the whole buffer, not per chunk: a CRLF can arrive split
    // across two reads.
    buffer = (buffer + decoder.decode(value, { stream: true })).replace(/\r\n/g, '\n');

    let cut;
    while ((cut = buffer.indexOf('\n\n')) !== -1) {
      const block = buffer.slice(0, cut);
      buffer = buffer.slice(cut + 2);

      let event = '';
      let data = '';
      for (const line of block.split('\n')) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) data += line.slice(5).trim();
      }
      if (data === '[DONE]') return;
      if (event !== 'response.output_text.delta' || !data) continue;
      try {
        const { delta } = JSON.parse(data);
        if (delta) yield delta;
      } catch {
        // A malformed frame is skipped rather than ending the whole answer.
      }
    }
  }
}

// The agent answers in light Markdown. Rendered by hand — bold, inline code,
// bullet lists, paragraphs — so no HTML from the network is ever injected.
function renderInline(text, keyBase) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    const key = `${keyBase}-${i}`;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={key}>{part.slice(1, -1)}</code>;
    }
    return <span key={key}>{part}</span>;
  });
}

function Markdown({ text }) {
  const blocks = [];
  let list = null;

  text.split('\n').forEach((raw, i) => {
    const line = raw.trimEnd();
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    if (bullet) {
      if (!list) {
        list = [];
        blocks.push({ type: 'ul', items: list, key: `ul-${i}` });
      }
      list.push({ text: bullet[1], key: `li-${i}` });
      return;
    }
    list = null;
    if (line.trim() === '') return;
    blocks.push({ type: 'p', text: line.replace(/^#{1,6}\s+/, ''), key: `p-${i}` });
  });

  return blocks.map((b) =>
    b.type === 'ul' ? (
      <ul key={b.key}>
        {b.items.map((it) => <li key={it.key}>{renderInline(it.text, it.key)}</li>)}
      </ul>
    ) : (
      <p key={b.key}>{renderInline(b.text, b.key)}</p>
    )
  );
}

export default function AskCv() {
  const revealRef = useScrollReveal();
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const logRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Keep the newest text in view while it streams, inside the log only —
  // the page itself must not jump.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages]);

  const userTurns = messages.filter((m) => m.role === 'user').length;
  const atLimit = userTurns >= MAX_USER_TURNS;

  const appendToLast = (chunk) =>
    setMessages((prev) => {
      const next = prev.slice();
      const last = next[next.length - 1];
      next[next.length - 1] = { ...last, content: last.content + chunk };
      return next;
    });

  const ask = async (question) => {
    const text = question.trim();
    if (!text || busy || atLimit) return;

    const history = [...messages, { role: 'user', content: text }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setDraft('');
    setError('');
    setBusy(true);

    try {
      let deltas;
      if (IS_DEV) {
        deltas = mockStream();
      } else {
        abortRef.current = new AbortController();
        const response = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
          signal: abortRef.current.signal,
        });
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.error?.message || 'The assistant could not answer. Try again.');
        }
        deltas = readDeltas(response);
      }

      let received = false;
      for await (const delta of deltas) {
        received = true;
        appendToLast(delta);
      }
      if (!received) throw new Error('The assistant sent an empty answer. Try again.');
    } catch (e) {
      if (e.name === 'AbortError') return;
      // Drop the empty assistant bubble and the question goes back to the box,
      // so a failed request costs the visitor nothing.
      setMessages(messages);
      setDraft(text);
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    ask(draft);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ask(draft);
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setError('');
    setBusy(false);
  };

  return (
    <section className="ask-cv section fade-up" id="ask" ref={revealRef}>
      <p className="section-label ask-cv__label">Ask the agent</p>

      <div className="ask-cv__header">
        <div>
          <h2 className="ask-cv__title">Ask my CV</h2>
          <p className="ask-cv__sub">
            An AI agent grounded in my structured CV. It cites what it finds
            and says so when something isn&apos;t there — paste a job
            description and it will name the gaps too.
          </p>
        </div>
        {messages.length > 0 && (
          <button type="button" className="ask-cv__reset" onClick={reset}>
            New conversation
          </button>
        )}
      </div>

      <div className="ask-cv__panel">
        <div
          className="ask-cv__log"
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-label="Conversation with the CV agent"
        >
          {messages.length === 0 ? (
            <div className="ask-cv__suggestions">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="ask-cv__chip"
                  onClick={() => ask(s)}
                  disabled={busy}
                >
                  {s}
                </button>
              ))}
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`ask-cv__msg ask-cv__msg--${m.role}`}>
                {m.role === 'assistant' ? (
                  m.content ? (
                    <Markdown text={m.content} />
                  ) : (
                    <span className="ask-cv__thinking" aria-label="Thinking">
                      <span /><span /><span />
                    </span>
                  )
                ) : (
                  <p>{m.content}</p>
                )}
              </div>
            ))
          )}
        </div>

        {error && <p className="ask-cv__error" role="alert">{error}</p>}

        {atLimit ? (
          <p className="ask-cv__limit">
            This conversation reached its limit.{' '}
            <button type="button" onClick={reset}>Start a new one</button>
          </p>
        ) : (
          <form className="ask-cv__form" onSubmit={onSubmit}>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              rows={2}
              maxLength={MAX_CHARS}
              placeholder="Ask about experience, projects, stack — or paste a job description"
              aria-label="Your question for the CV agent"
              disabled={busy}
            />
            <button type="submit" className="ask-cv__send" disabled={busy || !draft.trim()}>
              {busy ? 'Answering…' : 'Ask'}
            </button>
          </form>
        )}
      </div>

      <p className="ask-cv__note">
        Answers come from an AI agent and can be wrong — the CV is the source of truth.
      </p>
    </section>
  );
}

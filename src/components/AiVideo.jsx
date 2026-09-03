import { useEffect, useRef, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './AiVideo.css';

const HANDLE = 'eivan7678';
const PROFILE = `https://www.tiktok.com/@${HANDLE}`;

// Toolchain shown as chips — edit freely, these are the ones behind the videos.
const TOOLS = ['Veo', 'Kling', 'Midjourney', 'ElevenLabs'];

// Creator Profile Embed: TikTok resolves the most recent videos from the
// handle, so the carousel stays current without a redeploy.
const EMBED_HTML = `
<blockquote class="tiktok-embed"
  cite="${PROFILE}"
  data-unique-id="${HANDLE}"
  data-embed-type="creator"
  style="max-width: 780px; min-width: 288px;">
  <section>
    <a target="_blank" rel="noreferrer" href="${PROFILE}?refer=creator_embed">@${HANDLE} on TikTok</a>
  </section>
</blockquote>`;

const SCRIPT_SRC = 'https://www.tiktok.com/embed.js';

export default function AiVideo() {
  const revealRef = useScrollReveal();
  const slotRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // The TikTok script is heavy and third-party: only fetch it once the
  // section is close to the viewport, so it never costs initial page load.
  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        // Written outside React's tree — embed.js replaces this node itself.
        slot.innerHTML = EMBED_HTML;
        setLoaded(true);

        if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
        const script = document.createElement('script');
        script.src = SCRIPT_SRC;
        script.async = true;
        document.body.appendChild(script);
      },
      { rootMargin: '300px' }
    );

    observer.observe(slot);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="ai-video section fade-up" id="ai-video" ref={revealRef}>
      <p className="section-label ai-video__label">Generative video</p>

      <div className="ai-video__header">
        <div>
          <h2 className="ai-video__title">AI video lab</h2>
          <p className="ai-video__sub">
            Short-form video produced end to end with generative AI — concept,
            art direction, motion and sound — published as an ongoing series.
          </p>
        </div>
        <a
          className="ai-video__profile"
          href={PROFILE}
          target="_blank"
          rel="noreferrer"
        >
          @{HANDLE} →
        </a>
      </div>

      <ul className="ai-video__tools">
        {TOOLS.map((tool) => (
          <li key={tool} className="ai-video__tool">{tool}</li>
        ))}
      </ul>

      <div className="ai-video__frame">
        {/* Sibling, never a child of the slot: embed.js overwrites the slot's
            innerHTML, and React must not own any node in there. */}
        {!loaded && (
          <p className="ai-video__placeholder">Loading latest videos…</p>
        )}
        <div className="ai-video__slot" ref={slotRef} />
      </div>
    </section>
  );
}

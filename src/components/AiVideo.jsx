import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SiInstagram, SiTiktok } from 'react-icons/si';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './AiVideo.css';

const HANDLE = '_brownai_';
const PROFILE = `https://www.tiktok.com/@${HANDLE}`;
const ENDPOINT = '/api/tiktok.php';

// Where the videos live. The grid is fed from TikTok; Instagram carries the
// same videos, so it is a link only -- reading it would need Meta's Graph API
// and a token that expires every 60 days, for no new content.
const CHANNELS = [
  { name: 'TikTok',    icon: SiTiktok,    handle: `@${HANDLE}`, url: PROFILE },
  { name: 'Instagram', icon: SiInstagram, handle: `@${HANDLE}`, url: `https://www.instagram.com/${HANDLE}/` },
];

// Toolchain shown as chips — edit freely, these are the ones behind the videos.
const TOOLS = ['Nano Banana Pro', 'Seedance', 'Veo', 'Kling'];

const IS_DEV = process.env.NODE_ENV === 'development';

// The dev server cannot run PHP. Locally the list is fixed and the metadata
// comes straight from oEmbed, which allows cross-origin calls. In production
// tiktok.php finds the latest videos on its own.
const DEV_IDS = [
  '7691730827750706439',
  '7691730397922610440',
  '7691408733221424402',
  '7681120664505355538',
  '7680845143192161554',
  '7678982334510828808',
];

async function devVideos() {
  const results = await Promise.all(
    DEV_IDS.map((id) =>
      fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(`${PROFILE}/video/${id}`)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d && { id, title: d.title || '', thumbnail: d.thumbnail_url })
        .catch(() => null)
    )
  );
  return results.filter(Boolean);
}

// TikTok's official embed player. Unlike the profile carousel it does not
// shed load, and it honours autoplay.
const playerUrl = (id) =>
  `https://www.tiktok.com/player/v1/${id}?autoplay=1&rel=0&description=1&music_info=0`;

// Captions are mostly hashtags. Show the words; if there are none, the first tag.
function label(title) {
  const words = title.replace(/#\S+/g, '').replace(/[\s.·]+$/g, '').trim();
  if (words) return words;
  const tag = title.match(/#\S+/);
  return tag ? tag[0] : 'Watch video';
}

function Player({ video, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus?.();
    };
  }, [onClose]);

  // Portalled to <body>: the section animates with a transform, and a fixed
  // element inside a transformed ancestor is positioned against it, not the
  // viewport.
  return createPortal(
    <div
      className="ai-player"
      role="dialog"
      aria-modal="true"
      aria-label={label(video.title)}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ai-player__box">
        <iframe
          className="ai-player__frame"
          src={playerUrl(video.id)}
          title={label(video.title)}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen
        />
        <div className="ai-player__bar">
          <a href={`${PROFILE}/video/${video.id}`} target="_blank" rel="noreferrer">
            Open on TikTok →
          </a>
          <button type="button" ref={closeRef} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function AiVideo() {
  const revealRef = useScrollReveal();
  const frameRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | loading | ready | error
  const [videos, setVideos] = useState([]);
  const [active, setActive] = useState(null);
  const [broken, setBroken] = useState({});

  // Nothing is fetched until the section is near the viewport.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let cancelled = false;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setStatus('loading');
        try {
          let list;
          if (IS_DEV) {
            list = await devVideos();
          } else {
            const response = await fetch(ENDPOINT);
            if (!response.ok) throw new Error(String(response.status));
            list = (await response.json()).videos || [];
          }
          if (cancelled) return;
          if (!list.length) throw new Error('empty');
          setVideos(list);
          setStatus('ready');
        } catch {
          if (!cancelled) setStatus('error');
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(frame);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  const close = useCallback(() => setActive(null), []);

  return (
    <section className="ai-video section fade-up" id="ai-video" ref={revealRef}>
      <p className="section-label ai-video__label">Generative video</p>

      <div className="ai-video__header">
        <div>
          <h2 className="ai-video__title">AI video lab</h2>
          <p className="ai-video__sub">
            Short-form video shipped end to end by a crew of AI agents —
            concept, script, art direction, sound and review — looping until
            the cut works.
          </p>
        </div>
        <div className="ai-video__channels">
          {CHANNELS.map(({ name, icon: Icon, handle, url }) => (
            <a
              key={name}
              className="ai-video__channel"
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label={`${handle} on ${name}`}
            >
              <Icon size={13} aria-hidden="true" />
              {handle}
            </a>
          ))}
        </div>
      </div>

      <ul className="ai-video__tools">
        {TOOLS.map((tool) => (
          <li key={tool} className="ai-video__tool">{tool}</li>
        ))}
      </ul>

      <div className="ai-video__frame" ref={frameRef}>
        {status === 'ready' ? (
          <ul className="ai-video__grid">
            {videos.map((v) => (
              <li key={v.id}>
                <button
                  type="button"
                  className="ai-video__card"
                  onClick={() => setActive(v)}
                  aria-label={`Play: ${label(v.title)}`}
                >
                  {!broken[v.id] && (
                    <img
                      src={v.thumbnail}
                      alt=""
                      loading="lazy"
                      onError={() => setBroken((b) => ({ ...b, [v.id]: true }))}
                    />
                  )}
                  <span className="ai-video__badge" aria-hidden="true">
                    <SiTiktok size={11} />
                  </span>
                  <span className="ai-video__play" aria-hidden="true" />
                  <span className="ai-video__caption">{label(v.title)}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : status === 'error' ? (
          <p className="ai-video__fallback">
            <a href={PROFILE} target="_blank" rel="noreferrer">
              Watch the latest videos on TikTok →
            </a>
          </p>
        ) : (
          <p className="ai-video__placeholder">Loading latest videos…</p>
        )}
      </div>

      {status === 'ready' && (
        <p className="ai-video__note">
          Latest from TikTok, also on Instagram — new videos show up here on their own.
        </p>
      )}

      {active && <Player video={active} onClose={close} />}
    </section>
  );
}

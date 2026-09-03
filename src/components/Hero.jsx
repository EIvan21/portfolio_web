import { useState, useEffect } from 'react';
import './Hero.css';

const ROLES = [
  'Analytics Engineer',
  'Looker & LookML specialist',
  'BigQuery on Google Cloud',
];

const PIPELINE = [
  { name: 'sources',   meta: 'CSV · API · SQL' },
  { name: 'BigQuery',  meta: 'warehouse' },
  { name: 'AI agents', meta: 'LLM codegen', ai: true },
  { name: 'LookML',    meta: 'semantic model' },
  { name: 'Looker',    meta: 'dashboards' },
];

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Hero() {
  const [text, setText]         = useState('');
  const [roleIdx, setRoleIdx]   = useState(0);
  const [charIdx, setCharIdx]   = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused]     = useState(false);

  useEffect(() => {
    // Static role for users who prefer reduced motion — no typing loop.
    if (prefersReduced()) { setText(ROLES[0]); return; }
    if (paused) return;
    const role    = ROLES[roleIdx];
    const speed   = deleting ? 36 : 68;
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(role.slice(0, charIdx + 1));
        if (charIdx + 1 === role.length) {
          setPaused(true);
          setTimeout(() => { setPaused(false); setDeleting(true); }, 2300);
        } else {
          setCharIdx(c => c + 1);
        }
      } else {
        setText(role.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setRoleIdx(r => (r + 1) % ROLES.length);
          setCharIdx(0);
        } else {
          setCharIdx(c => c - 1);
        }
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, roleIdx, paused]);

  return (
    <section className="hero section" id="about">
      <div className="hero__grid">
        <div className="hero__main">
          <p className="hero__eyebrow">Google Cloud Engineer @ GlobalLogic</p>

          <h1 className="hero__name">
            <span className="hero__word hero__word--1">Edher</span>{' '}
            <span className="hero__word hero__word--2">Ivan</span>
          </h1>

          <div className="hero__role">
            <span className="hero__caret" aria-hidden="true">&gt;</span>
            <span>{text}</span>
            <span className="hero__cursor" aria-hidden="true" />
          </div>

          <p className="hero__bio">
            Analytics Engineer specialized in Looker, LookML and BigQuery on
            Google Cloud. I design semantic models, automate LookML development
            with LLM agents, and build analytics dashboards that teams actually
            use.
          </p>

          <div className="hero__actions">
            <a href="#projects" className="btn-primary">View projects →</a>
            <a href="/Edher_Ivan_Diaz_CV_EN.pdf" download className="btn-outline">
              Download CV
            </a>
          </div>

          <p className="hero__cv-alt">
            <a href="/Edher_Ivan_Diaz_CV_ES.pdf" download>CV en español</a>
          </p>

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-num">4+</span>
              <span className="hero__stat-label">years experience</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-num">30+</span>
              <span className="hero__stat-label">open-source blocks</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-num">45</span>
              <span className="hero__stat-label">merged PRs</span>
            </div>
          </div>
        </div>

        <aside className="hero__aside" aria-hidden="true">
          <div className="pipeline">
            <div className="pipeline__line">
              <span className="pipeline__dot pipeline__dot--1" />
              <span className="pipeline__dot pipeline__dot--2" />
              <span className="pipeline__dot pipeline__dot--3" />
            </div>
            {PIPELINE.map((n) => (
              <div
                key={n.name}
                className={`pipeline__node ${n.ai ? 'pipeline__node--ai' : ''}`}
              >
                <span className="pipeline__marker" />
                <div className="pipeline__text">
                  <span className="pipeline__name">{n.name}</span>
                  <span className="pipeline__meta">{n.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

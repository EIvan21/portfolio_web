import { useState, useEffect } from 'react';
import './Hero.css';

const ROLES = [
  'Data & Cloud Engineer',
  'BigQuery · LookML · Python',
  'Google Cloud Specialist',
  'AI Analytics Developer',
];

export default function Hero() {
  const [text, setText]         = useState('');
  const [roleIdx, setRoleIdx]   = useState(0);
  const [charIdx, setCharIdx]   = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused]     = useState(false);

  useEffect(() => {
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
      <p className="section-label">Google Cloud Engineer @ GlobalLogic</p>

      <h1 className="hero__name">
        <span className="hero__word hero__word--1">Edher</span>{' '}
        <span className="hero__word hero__word--2">Ivan</span>
      </h1>

      <div className="hero__role">
        <span>{text}</span>
        <span className="hero__cursor" aria-hidden="true">|</span>
      </div>

      <p className="hero__bio">
        Data &amp; Cloud Engineer specialized in BigQuery, PySpark and LookML.
        I optimize data pipelines, automate workflows and build high-impact
        analytics dashboards on Google Cloud.
      </p>

      <div className="hero__actions">
        <a href="#projects" className="btn-primary">View projects →</a>
        <a href="/Edher_Ivan_CV.pdf" download className="btn-outline">
          Download CV
        </a>
      </div>

      <div className="hero__stats">
        <div className="hero__stat">
          <span className="hero__stat-num">5+</span>
          <span className="hero__stat-label">Years experience</span>
        </div>
        <div className="hero__stat">
          <span className="hero__stat-num">30+</span>
          <span className="hero__stat-label">Open-source blocks</span>
        </div>
        <div className="hero__stat">
          <span className="hero__stat-num">45</span>
          <span className="hero__stat-label">Merged PRs</span>
        </div>
      </div>
    </section>
  );
}

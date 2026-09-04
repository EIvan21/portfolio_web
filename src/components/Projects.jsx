import { useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Projects.css';

const VISIBLE = 4;

const PROJECTS = [
  {
    tag: 'AI',
    name: 'Looker Architect',
    desc: 'AI agent skill that designs and scaffolds clean, well-structured LookML projects.',
    url: 'https://github.com/looker-open-source/looker-skills/tree/main/skills/looker-architect',
    author: true,
    ai: true,
  },
  {
    tag: 'AI',
    name: 'Looker Performance Optimizer',
    desc: 'AI agent skill that generates and refactors LookML for performance.',
    url: 'https://github.com/looker-open-source/looker-skills/tree/main/skills/looker-performance-optimizer',
    author: true,
    ai: true,
  },
  {
    tag: 'LookML',
    name: 'Agent Analytics Block',
    desc: 'Looker block to monitor and optimize GenAI agents on BigQuery Agent Analytics, built with Native Derived Tables, Liquid templating, and advanced drilling.',
    url: 'https://github.com/looker-open-source/agent-analytics-block',
    author: true,
  },
  {
    tag: 'LookML',
    name: 'GA Four Block',
    desc: 'Google Analytics 4 block with incremental sessionization in BigQuery, BigQuery ML propensity models, and acquisition, behavior, and cohort dashboards.',
    url: 'https://github.com/looker-open-source/ga_four_block',
    author: false,
  },
  {
    tag: 'LookML',
    name: 'AlloyDB Observability',
    desc: 'Operational observability suite for AlloyDB: health monitoring, performance, real-time activity and PostgreSQL KPIs with a two-layer refinement architecture.',
    url: 'https://github.com/looker-open-source/alloydb-observability',
    author: false,
  },
  {
    tag: 'LookML',
    name: 'Google Trends Block',
    desc: 'Looker block on top of the Google Trends public dataset in BigQuery to explore search interest trends and seasonality.',
    url: 'https://github.com/looker-open-source/google-trends-block',
    author: false,
  },
];

export default function Projects() {
  const ref = useScrollReveal();
  const [expanded, setExpanded] = useState(false);

  const shown = expanded ? PROJECTS : PROJECTS.slice(0, VISIBLE);
  const hiddenCount = PROJECTS.length - VISIBLE;

  return (
    <section className="projects section fade-up" ref={ref} id="projects">
      <div className="projects__header">
        <div>
          <p className="section-label">Projects</p>
          <h2 className="projects__title">Looker Open Source</h2>
          <p className="projects__sub">
            40 repos contributed · 3 as lead author
          </p>
        </div>
        <a
          href="https://github.com/heyedher"
          target="_blank"
          rel="noreferrer"
          className="projects__profile-link"
        >
          @heyedher on GitHub →
        </a>
      </div>

      <div className="projects__grid">
        {shown.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className={`project-card ${p.ai ? 'project-card--ai' : p.author ? 'project-card--featured' : ''}`}
          >
            <div className="project-card__top">
              <span className={`project-card__tag ${p.ai ? 'project-card__tag--ai' : ''}`}>{p.tag}</span>
              {p.author && (
                <span className={`project-card__badge ${p.ai ? 'project-card__badge--ai' : ''}`}>Lead author</span>
              )}
            </div>
            <p className="project-card__name">{p.name}</p>
            <p className="project-card__desc">{p.desc}</p>
            <p className="project-card__link">View repository →</p>
          </a>
        ))}
      </div>

      {hiddenCount > 0 && (
        <div className="projects__more">
          <button
            type="button"
            className="projects__more-btn"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        </div>
      )}
    </section>
  );
}

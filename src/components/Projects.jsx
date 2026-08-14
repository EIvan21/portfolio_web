import { useScrollReveal } from '../hooks/useScrollReveal';
import './Projects.css';

const PROJECTS = [
  {
    tag: 'AI',
    name: 'Looker Performance Optimizer',
    desc: 'AI agent skill that helps developers generate and refactor LookML for performance — producing faster, higher-quality code and surfacing optimization opportunities.',
    url: 'https://github.com/looker-open-source/looker-skills/tree/main/skills/looker-performance-optimizer',
    author: true,
    ai: true,
  },
  {
    tag: 'AI',
    name: 'Looker Architect',
    desc: 'AI agent skill that helps developers design and scaffold LookML projects, generating clean, well-structured and high-quality code faster.',
    url: 'https://github.com/looker-open-source/looker-skills/tree/main/skills/looker-architect',
    author: true,
    ai: true,
  },
  {
    tag: 'LookML',
    name: 'Agent Analytics Block',
    desc: 'Looker block to monitor, debug and optimize generative AI agents on top of BigQuery Agent Analytics. Built with Native Derived Tables, Liquid templating and advanced visual drilling.',
    url: 'https://github.com/looker-open-source/agent-analytics-block',
    author: true,
  },
  {
    tag: 'LookML',
    name: 'GA Four Block',
    desc: 'Looker block for Google Analytics 4: incremental sessionization in BigQuery, BQML propensity models and dashboards for acquisition, behavior and cohorts.',
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

  return (
    <section className="projects section fade-up" ref={ref} id="projects">
      <div className="projects__header">
        <div>
          <p className="section-label">Projects</p>
          <h2 className="projects__title">Looker Open Source</h2>
          <p className="projects__sub">30+ blocks · github.com/looker-open-source</p>
        </div>
        <a
          href="https://github.com/heyedher"
          target="_blank"
          rel="noreferrer"
          className="projects__profile-link"
        >
          View profile →
        </a>
      </div>

      <div className="projects__grid">
        {PROJECTS.map((p) => (
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
    </section>
  );
}

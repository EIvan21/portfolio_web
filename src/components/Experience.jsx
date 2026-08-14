import { useScrollReveal } from '../hooks/useScrollReveal';
import './Experience.css';

const JOBS = [
  {
    role: 'Google Cloud Engineer',
    company: 'GlobalLogic',
    period: 'Aug 2024 — Present',
    current: true,
    stack: ['LLM agents', 'LookML', 'BigQuery', 'Python', 'Looker'],
    bullets: [
      'Engineered custom AI integrations and prompt frameworks for leading LLM agents (Gemini, Claude Code, Codex, Cursor), automating LookML code generation to accelerate development workflows and deploy advanced dashboard navigation features.',
      'Developed and implemented a methodology for building and maintaining projects using LookML, Python and BigQuery, reducing development time by 30%.',
      'Developed a Python and BigQuery-based methodology to generate synthetic data, enhancing dashboard development and customization while reducing data creation time by 40%.',
      'Led customer meetings to define key metrics, drill-downs, visualizations and communication channels for marketing dashboards.',
    ],
  },
  {
    role: 'Looker Consultant Analyst',
    company: 'GTEC',
    period: 'Dec 2023 — Aug 2024',
    stack: ['Python', 'BigQuery', 'Looker', 'DataFlow'],
    bullets: [
      'Implemented a forecast model for inventory management, reducing overstock by 30%.',
      'Led data visualization, ingestion and KPI analysis for business insights using Python, BigQuery, Looker and DataFlow.',
      'Developed and maintained data models for predictive analytics and dashboard performance improvements.',
    ],
  },
  {
    role: 'Technical Support Specialist · Google Looker',
    company: 'Infosys',
    period: 'Dec 2021 — Dec 2023',
    stack: ['Looker', 'PostgreSQL', 'MySQL'],
    bullets: [
      'Resolved 400+ data analytics cases, improving customer satisfaction to an average of 4.5/5.',
      'Spearheaded data governance policies across multiple Looker instances, ensuring compliance and data quality.',
      'Designed dashboards and optimized database connections for PostgreSQL, MySQL and other databases.',
    ],
  },
];

// Highlight metrics (30%, 40%, 400+, 4.5/5) inside a bullet string.
const METRIC_SPLIT = /(\d[\d.,]*(?:%|\+|\/5))/g;
const METRIC_TEST  = /^\d[\d.,]*(?:%|\+|\/5)$/;

function renderBullet(text) {
  return text.split(METRIC_SPLIT).map((part, i) =>
    METRIC_TEST.test(part)
      ? <strong key={i} className="exp__hi">{part}</strong>
      : <span key={i}>{part}</span>
  );
}

export default function Experience() {
  const ref = useScrollReveal();

  return (
    <section className="experience section fade-up" ref={ref} id="experience">
      <p className="section-label">Professional experience</p>

      <div className="exp__timeline">
        <div className="exp__flow" aria-hidden="true">
          <span className="exp__flow-dot exp__flow-dot--1" />
          <span className="exp__flow-dot exp__flow-dot--2" />
          <span className="exp__flow-dot exp__flow-dot--3" />
        </div>
        {JOBS.map((j) => {
          const [from, to] = j.period.split('—').map((s) => s.trim());
          return (
            <article
              className={`exp__item ${j.current ? 'exp__item--current' : ''}`}
              key={j.company}
            >
              <div className="exp__rail">
                <span className="exp__rail-from">{from}</span>
                <span className="exp__rail-to">{to}</span>
              </div>

              <div className="exp__card">
                <div className="exp__head">
                  <h3 className="exp__role">{j.role}</h3>
                  {j.current && <span className="exp__badge">Current</span>}
                </div>
                <p className="exp__company">{j.company}</p>

                <ul className="exp__bullets">
                  {j.bullets.map((b, i) => <li key={i}>{renderBullet(b)}</li>)}
                </ul>

                <div className="exp__stack">
                  {j.stack.map((t) => (
                    <span key={t} className="exp__tag">{t}</span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

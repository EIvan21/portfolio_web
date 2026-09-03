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
      'Engineered LLM-agent integrations and prompt frameworks (Gemini, Claude Code, Codex, Cursor) that generate and refactor LookML automatically, accelerating dashboard delivery.',
      'Designed a LookML/Python/BigQuery methodology adopted across projects, cutting development time 30%.',
      'Built a Python/BigQuery synthetic data generator for dashboard builds and demos, cutting data creation time 40%.',
      'Led client workshops to define KPIs, drill-downs, and visualizations for marketing dashboards shipped to production.',
    ],
  },
  {
    role: 'Looker Consultant',
    company: 'GTEC',
    period: 'Dec 2023 — Aug 2024',
    stack: ['Python', 'BigQuery', 'Looker', 'Dataflow'],
    bullets: [
      'Implemented an inventory forecast model that reduced overstock by 30%.',
      'Owned data ingestion, visualization, and KPI analysis with Python, BigQuery, Dataflow, and Looker.',
      'Developed and maintained data models for predictive analytics, improving dashboard performance.',
    ],
  },
  {
    role: 'Technical Support Specialist · Google Looker',
    company: 'Infosys',
    period: 'Dec 2021 — Dec 2023',
    stack: ['Looker', 'PostgreSQL', 'MySQL'],
    bullets: [
      'Resolved 400+ data analytics cases for Looker customers, raising average customer satisfaction to 4.5/5.',
      'Implemented data governance policies across multiple Looker instances, ensuring compliance and data quality.',
      'Designed customer dashboards and optimized Looker connections to PostgreSQL, MySQL, and other databases.',
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

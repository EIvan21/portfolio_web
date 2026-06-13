import { useScrollReveal } from '../hooks/useScrollReveal';
import './Experience.css';

const JOBS = [
  {
    role: 'Google Cloud Engineer',
    company: 'GlobalLogic',
    period: 'Aug 2024 — Present',
    current: true,
    bullets: [
      'Lead the development of solutions to enhance marketing campaign performance using Google Cloud tools and integrating Data Transfer processes in BigQuery.',
      'Designed a methodology to build and maintain projects with LookML, Python and BigQuery, reducing development time by 30%.',
      'Built a Python and BigQuery-based method to generate synthetic data, accelerating dashboard development and reducing data creation time by 40%.',
      'Lead customer meetings to define key metrics, drill-downs, visualizations and communication channels for marketing dashboards.',
    ],
  },
  {
    role: 'Looker Consultant Analyst',
    company: 'GTEC',
    period: 'Dec 2023 — Aug 2024',
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
    bullets: [
      'Resolved 400+ data analytics cases, improving customer satisfaction to an average of 4.5/5.',
      'Spearheaded data governance policies across multiple Looker instances, ensuring compliance and data quality.',
      'Designed dashboards and optimized database connections for PostgreSQL, MySQL and other databases.',
    ],
  },
];

export default function Experience() {
  const ref = useScrollReveal();

  return (
    <section className="experience section fade-up" ref={ref} id="experience">
      <p className="section-label">Professional experience</p>

      <div className="exp__timeline">
        {JOBS.map((j) => (
          <article className="exp__item" key={j.company}>
            <span className="exp__marker" aria-hidden="true" />
            <div className="exp__body">
              <div className="exp__head">
                <h3 className="exp__role">{j.role}</h3>
                {j.current && <span className="exp__badge">Current</span>}
              </div>
              <p className="exp__meta">{j.company} · {j.period}</p>
              <ul className="exp__bullets">
                {j.bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

import { useScrollReveal } from '../hooks/useScrollReveal';
import './Skills.css';

const STACK = [
  // BI & Analytics
  { label: 'Looker',                            group: 'bi' },
  { label: 'LookML',                            group: 'bi' },
  { label: 'Looker Studio',                     group: 'bi' },
  { label: 'Semantic & dimensional modeling',   group: 'bi' },
  { label: 'Dashboard design',                  group: 'bi' },
  // Data & Cloud
  { label: 'BigQuery',                          group: 'cloud' },
  { label: 'SQL',                               group: 'cloud' },
  { label: 'Python',                            group: 'cloud' },
  { label: 'Dataflow',                          group: 'cloud' },
  { label: 'PySpark',                           group: 'cloud' },
  { label: 'Vertex AI',                         group: 'cloud' },
  { label: 'Cloud Storage',                     group: 'cloud' },
  // Data Science
  { label: 'pandas',                            group: 'data' },
  { label: 'NumPy',                             group: 'data' },
  { label: 'scikit-learn',                      group: 'data' },
  { label: 'Matplotlib',                        group: 'data' },
  { label: 'Forecasting',                       group: 'data' },
  { label: 'BigQuery ML',                       group: 'data' },
  // AI & Tooling
  { label: 'LLM agents',                        group: 'tools' },
  { label: 'Prompt engineering',                group: 'tools' },
  { label: 'Git',                               group: 'tools' },
  { label: 'Jupyter',                           group: 'tools' },
  { label: 'FastAPI',                           group: 'tools' },
];

const CERTS = [
  {
    name: 'Associate Cloud Engineer',
    org: 'Google Cloud · 2026',
  },
  {
    name: 'Generative AI Leader',
    org: 'Google Cloud · 2025',
    ai: true,
  },
  {
    name: 'Data Engineer',
    org: 'DataCamp · 2025',
  },
];

export default function Skills() {
  const stackRef = useScrollReveal();
  const certRef  = useScrollReveal();

  return (
    <>
      <section className="skills section fade-up" ref={stackRef}>
        <p className="section-label">Stack & tools</p>
        <div className="skills__chips">
          {STACK.map((s, i) => (
            <span
              key={s.label}
              className={`skill-chip skill-chip--${s.group}`}
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              {s.label}
            </span>
          ))}
        </div>
      </section>

      <section className="certs section fade-up" ref={certRef}>
        <p className="section-label">Certifications</p>
        <div className="certs__list">
          {CERTS.map((c) => {
            const [org, year] = c.org.split('·').map((x) => x.trim());
            return (
              <div
                key={c.name}
                className={`cert-card ${c.ai ? 'cert-card--ai' : ''}`}
              >
                <p className="cert-card__name">{c.name}</p>
                <p className="cert-card__org">
                  <span className="cert-card__org-name">{org}</span>
                  {year && <span className="cert-card__year">{year}</span>}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

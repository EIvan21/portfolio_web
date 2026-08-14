import { useScrollReveal } from '../hooks/useScrollReveal';
import './Skills.css';

const STACK = [
  { label: 'Python',       group: 'prog' },
  { label: 'SQL',          group: 'prog' },
  { label: 'LookML',       group: 'prog' },
  { label: 'FastAPI',      group: 'prog' },
  { label: 'React',        group: 'prog' },
  { label: 'JavaScript',   group: 'prog' },
  { label: 'BigQuery',     group: 'cloud' },
  { label: 'DataFlow',     group: 'cloud' },
  { label: 'VertexAI',     group: 'cloud' },
  { label: 'Cloud Storage',group: 'cloud' },
  { label: 'Looker Studio',group: 'cloud' },
  { label: 'PySpark',      group: 'data' },
  { label: 'Pandas',       group: 'data' },
  { label: 'NumPy',        group: 'data' },
  { label: 'Scikit-learn', group: 'data' },
  { label: 'Git',          group: 'tools' },
  { label: 'Jupyter',      group: 'tools' },
];

const CERTS = [
  {
    name: 'Associate Cloud Engineer',
    org: 'Google Cloud · 2026',
    desc: 'Established and configured foundational Google Cloud environments — planning, deploying and securing a variety of cloud solutions.',
  },
  {
    name: 'Generative AI Leader',
    org: 'Google Cloud · 2025',
    ai: true,
    desc: "Applied business-level knowledge of Google Cloud's Gen AI offerings to identify transformation opportunities and guide responsible AI adoption.",
  },
  {
    name: 'Data Engineer',
    org: 'DataCamp · 2025',
    desc: 'Proven expertise in SQL and data management — data cleaning and transformation, assessed through real-world engineering challenges.',
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
                <p className="cert-card__desc">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

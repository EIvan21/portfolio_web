import { useScrollReveal } from '../hooks/useScrollReveal';
import './Education.css';

const EDUCATION = [
  {
    degree: 'MSc in Applied Artificial Intelligence',
    school: 'Tecnológico de Monterrey',
    period: 'In progress',
    detail: '2026 — Present · expected 2028',
    ai: true,
  },
  {
    degree: 'Diploma in Data Science',
    school: 'Skills Tech · Mexico',
    period: '2022 — 2023',
    note: "Capstone: electricity price forecasting for Mexico's wholesale market with Python and SQL; Kimball methodology and data governance.",
  },
  {
    degree: 'BSc in Energy Engineering',
    school: 'Universidad Autónoma Metropolitana',
    period: '2016 — 2021',
    note: 'University Merit Medal for the top GPA of the graduating class.',
  },
];

export default function Education() {
  const ref = useScrollReveal();

  return (
    <section className="education section fade-up" ref={ref} id="education">
      <p className="section-label">Education</p>

      <div className="edu__list">
        {EDUCATION.map((e) => (
          <article
            className={`edu__card ${e.ai ? 'edu__card--ai' : ''}`}
            key={e.degree}
          >
            <div className="edu__head">
              <h3 className="edu__degree">{e.degree}</h3>
              {e.period === 'In progress' ? (
                <span className="edu__badge">In progress</span>
              ) : (
                <span className="edu__period">{e.period}</span>
              )}
            </div>
            <p className="edu__school">{e.school}</p>
            {e.detail && <p className="edu__detail">{e.detail}</p>}
            {e.note && <p className="edu__note">{e.note}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

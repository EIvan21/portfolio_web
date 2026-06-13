import { useScrollReveal } from '../hooks/useScrollReveal';
import './Education.css';

const EDUCATION = [
  {
    degree: 'MSc in Applied Artificial Intelligence',
    school: 'Tecnológico de Monterrey',
    period: 'In progress',
    note: 'Building advanced competencies in applied AI and emerging technologies to drive innovation and lead strategic organizational transformation.',
  },
  {
    degree: 'Diploma in Data Science',
    school: 'Skills Tech · Mexico',
    period: '2022 — 2023',
    note: 'Capstone project: analysis and prediction of energy prices in the Mexican Wholesale Electricity Market. Focus on Python, SQL, Data Governance and the Kimball methodology.',
  },
  {
    degree: 'BSc in Energy Engineering',
    school: 'Universidad Autónoma Metropolitana',
    period: '2016 — 2021',
    note: 'Awarded the University Merit Medal for academic excellence and the top-ranking GPA in the graduating class.',
  },
];

export default function Education() {
  const ref = useScrollReveal();

  return (
    <section className="education section fade-up" ref={ref} id="education">
      <p className="section-label">Education</p>

      <div className="edu__list">
        {EDUCATION.map((e) => (
          <article className="edu__card" key={e.degree}>
            <div className="edu__head">
              <h3 className="edu__degree">{e.degree}</h3>
              <span className="edu__period">{e.period}</span>
            </div>
            <p className="edu__school">{e.school}</p>
            <p className="edu__note">{e.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

import { useScrollReveal } from '../hooks/useScrollReveal';
import './Projects.css';

const PROJECTS = [
  {
    tag: 'LookML',
    name: 'Agent Analytics Block',
    desc: 'Bloque de Looker para monitorear, depurar y optimizar agentes de IA generativa sobre BigQuery Agent Analytics. Arquitectura con Native Derived Tables, Liquid Templating y drilling visual avanzado.',
    url: 'https://github.com/looker-open-source/agent-analytics-block',
    author: true,
  },
  {
    tag: 'LookML',
    name: 'GA Four Block',
    desc: 'Bloque de Looker para Google Analytics 4: sessionización incremental en BigQuery, modelos BQML de propensión y dashboards de adquisición, comportamiento y cohortes.',
    url: 'https://github.com/looker-open-source/ga_four_block',
    author: false,
  },
  {
    tag: 'LookML',
    name: 'AlloyDB Observability',
    desc: 'Suite de observabilidad operacional para AlloyDB: monitoreo de salud, rendimiento, actividad en tiempo real y KPIs de PostgreSQL con arquitectura de refinamiento de dos capas.',
    url: 'https://github.com/looker-open-source/alloydb-observability',
    author: false,
  },
  {
    tag: 'JavaScript',
    name: 'Looker Skills',
    desc: 'Repositorio de skills LookML para asistir a agentes de IA (Gemini, Claude Code, Cursor) en escribir código estandarizado. Incluye guías para Models, Explores, Views y Fields.',
    url: 'https://github.com/looker-open-source/looker-skills',
    author: false,
  },
];

export default function Projects() {
  const ref = useScrollReveal();

  return (
    <section className="projects section fade-up" ref={ref} id="projects">
      <div className="projects__header">
        <div>
          <p className="section-label">Proyectos</p>
          <h2 className="projects__title">Looker Open Source</h2>
          <p className="projects__sub">github.com/looker-open-source</p>
        </div>
        <a
          href="https://github.com/EIvan21"
          target="_blank"
          rel="noreferrer"
          className="projects__profile-link"
        >
          Ver perfil →
        </a>
      </div>

      <div className="projects__grid">
        {PROJECTS.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className={`project-card ${p.author ? 'project-card--featured' : ''}`}
          >
            <div className="project-card__top">
              <span className="project-card__tag">{p.tag}</span>
              {p.author && (
                <span className="project-card__badge">Autor principal</span>
              )}
            </div>
            <p className="project-card__name">{p.name}</p>
            <p className="project-card__desc">{p.desc}</p>
            <p className="project-card__link">Ver repositorio →</p>
          </a>
        ))}
      </div>
    </section>
  );
}

import './styles/variables.css';
import Navbar     from './components/Navbar';
import Hero       from './components/Hero';
import Experience from './components/Experience';
import Projects   from './components/Projects';
import Skills     from './components/Skills';
import Education  from './components/Education';
import Contact    from './components/Contact';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>
      <footer style={{
        textAlign: 'center',
        padding: '2rem 1rem',
        fontSize: '12px',
        color: 'var(--text-muted)',
        borderTop: '0.5px solid var(--border)'
      }}>
        Edher Ivan · {new Date().getFullYear()} ·{' '}
        <a href="https://github.com/EIvan21" target="_blank" rel="noreferrer"
           style={{ color: 'var(--accent)', textDecoration: 'none' }}>
          github.com/EIvan21
        </a>
      </footer>
    </>
  );
}

export default App;

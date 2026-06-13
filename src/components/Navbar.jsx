import { useState, useEffect } from 'react';
import { FiGithub } from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <span className="navbar__logo">
        EI<span className="navbar__dot">.</span>
      </span>

      <div className="navbar__links">
        <a href="#about">Sobre mí</a>
        <a href="#projects">Proyectos</a>
        <a href="#contact">Contacto</a>
        <a
          href="https://github.com/EIvan21"
          target="_blank"
          rel="noreferrer"
          className="navbar__github"
        >
          <FiGithub size={15} />
          EIvan21
        </a>
      </div>
    </nav>
  );
}

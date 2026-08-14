import { useState, useEffect } from 'react';
import { FiGithub, FiSun, FiMoon } from 'react-icons/fi';
import './Navbar.css';

const LINKS = [
  { id: 'about',      label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects',   label: 'Projects' },
  { id: 'contact',    label: 'Contact' },
];

function getInitialTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  // Dark by default; a saved choice from the toggle always wins.
  return 'dark';
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]     = useState('about');
  const [theme, setTheme]       = useState(getInitialTheme);

  // Apply + persist theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Navbar border on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll spy — highlight the section in view
  useEffect(() => {
    const sections = LINKS
      .map((l) => document.getElementById(l.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <span className="navbar__logo">
        EI<span className="navbar__dot">.</span>
      </span>

      <div className="navbar__links">
        {LINKS.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            className={active === l.id ? 'active' : undefined}
          >
            {l.label}
          </a>
        ))}
        <a
          href="https://github.com/heyedher"
          target="_blank"
          rel="noreferrer"
          className="navbar__github"
        >
          <FiGithub size={15} />
          heyedher
        </a>
        <button
          type="button"
          className="navbar__theme"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <FiSun size={15} /> : <FiMoon size={15} />}
        </button>
      </div>
    </nav>
  );
}

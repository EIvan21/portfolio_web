import { useState, useRef } from 'react';
import emailjs from 'emailjs-com';
import { FiLinkedin, FiGithub, FiMail } from 'react-icons/fi';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Contact.css';

const SOCIALS = [
  { icon: FiLinkedin, label: 'LinkedIn',          url: 'https://www.linkedin.com/in/edherdiaz' },
  { icon: FiGithub,   label: 'heyedher', url: 'https://github.com/heyedher' },
  { icon: FiGithub,   label: 'EIvan21',  url: 'https://github.com/EIvan21' },
  { icon: FiMail,     label: 'Email',             url: 'mailto:edher.diaz21@gmail.com' },
];

const EMAILJS_SERVICE  = 'service_nf25nt9';
const EMAILJS_TEMPLATE = 'template_jd1ol8d';
const EMAILJS_USER     = 'NVZ4Wky133jfv3F-4';

export default function Contact() {
  const ref    = useScrollReveal();
  const formEl = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    emailjs
      .sendForm(EMAILJS_SERVICE, EMAILJS_TEMPLATE, formEl.current, EMAILJS_USER)
      .then(() => { setStatus('ok');    formEl.current.reset(); })
      .catch(() => { setStatus('error'); });
  };

  return (
    <section className="contact section fade-up" ref={ref} id="contact">
      <p className="section-label">Contact</p>
      <h2 className="contact__title">Let's work together</h2>
      <p className="contact__sub">
        Open to data and cloud projects.{' '}
        <a href="mailto:edher.diaz21@gmail.com">edher.diaz21@gmail.com</a>
      </p>

      <div className="contact__socials">
        {SOCIALS.map(({ icon: Icon, label, url }) => (
          <a
            key={label}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="contact__social"
          >
            <Icon size={16} />
            {label}
          </a>
        ))}
      </div>

      <form className="contact__form" ref={formEl} onSubmit={handleSubmit}>
        <div className="contact__row">
          <input name="name"  type="text"  placeholder="Your name"  aria-label="Your name"  required />
          <input name="email" type="email" placeholder="Your email" aria-label="Your email" required />
        </div>
        <textarea name="message" rows="5" placeholder="How can I help you?" aria-label="Your message" required />
        <button type="submit" className="btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        {status === 'ok'    && <p className="contact__msg contact__msg--ok">Message sent!</p>}
        {status === 'error' && <p className="contact__msg contact__msg--err">Something went wrong. Please try again.</p>}
      </form>
    </section>
  );
}

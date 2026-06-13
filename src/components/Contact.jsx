import { useState, useRef } from 'react';
import emailjs from 'emailjs-com';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Contact.css';

const EMAILJS_SERVICE  = 'service_qc30ksk';
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
      <p className="section-label">Contacto</p>
      <h2 className="contact__title">¿Trabajamos juntos?</h2>
      <p className="contact__sub">
        Abierto a proyectos de datos y cloud.{' '}
        <a href="mailto:edher.diaz21@gmail.com">edher.diaz21@gmail.com</a>
      </p>

      <form className="contact__form" ref={formEl} onSubmit={handleSubmit}>
        <div className="contact__row">
          <input name="name"  type="text"  placeholder="Tu nombre"  required />
          <input name="email" type="email" placeholder="Tu correo"  required />
        </div>
        <textarea name="message" rows="5" placeholder="¿En qué te puedo ayudar?" required />
        <button type="submit" className="btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
        </button>
        {status === 'ok'    && <p className="contact__msg contact__msg--ok">¡Mensaje enviado!</p>}
        {status === 'error' && <p className="contact__msg contact__msg--err">Algo salió mal. Intenta de nuevo.</p>}
      </form>
    </section>
  );
}

import React from "react";
import "./Contact.css";
import { MdOutlineEmail } from "react-icons/md";
import { RiMessengerLine } from "react-icons/ri";
import { BsWhatsapp } from "react-icons/bs";

import { useRef } from "react";
import emailjs from "emailjs-com";

function Contact() {
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_qc30ksk",
        "template_jd1ol8d",
        form.current,
        "NVZ4Wky133jfv3F-4"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );

    e.target.reset();
  };

  return (
    <section id="contact">
      <h5>Get in touch</h5>
      <h2>Contact me</h2>

      <div className="container contact__container">
        <div className="contact__options">
          <article className="contact__option">
            <MdOutlineEmail className="contact_option-icon" />
            <h4>Email</h4>
            <h5>edher.diaz21@gmail.com</h5>
            <a href="mailto:edher.diaz21@gmail.com" target="_blank">
              Send a message
            </a>
          </article>
          {/* <article className="contact__option">
            <RiMessengerLine className="contact_option-icon" />
            <h4>Messenger</h4>
            <h5>Edher Ivan</h5>
            <a
              href="https://m.me/profile.php?id=100007830677062"
              target="_blank"
            >
              Send a message
            </a>
          </article> */}
          {/* <article className="contact__option">
            <BsWhatsapp className="contact_option-icon" />
            <h4>WhatssApp</h4>

            <a
              href="https://api.whatsapp.com/send?phone=525584698350"
              target="_blank"
            >
              Send a message
            </a>
          </article> */}
        </div>
        {/* ======= FORM ====== */}

        <form ref={form} onSubmit={sendEmail}>
          <input
            type="text"
            name="name"
            placeholder="Your Full Name"
            required
          />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea
            name="message"
            cols="30"
            rows="7"
            placeholder="Your Message"
            required
          ></textarea>
          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;

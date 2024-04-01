import React from "react";
import "./Footer.css";

import { FaFacebook } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import { IoLogoTwitter } from "react-icons/io";

function Footer() {
  return (
    <section id="footer">
      <footer>
        <a href="#" className="footer__logo">
          EDHER DIAZ
        </a>
        <ul className="permalinks">
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#experience">Experience</a>
          </li>

          <li>
            <a href="#portfolio">Portfolio</a>
          </li>

          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>

        <div className="footer__socials">
          {/* <a
            href="https://www.facebook.com/profile.php?id=100007830677062"
            target="_blank"
          >
            <FaFacebook />
          </a> */}
          <a href="https://www.instagram.com/ivan_diaz21/" target="_blank">
            <FiInstagram />
          </a>
          <a
            href="https://twitter.com/_EDHER_IVAN?t=LXWISCJivval_6NLNqB_Wg&s=08"
            target="_blank"
          >
            <IoLogoTwitter />
          </a>
        </div>

        <div className="footer__copyright">
          <small>&copy; Edher Diaz. All rights reserved</small>
        </div>
      </footer>
    </section>
  );
}

export default Footer;

import React from "react";
import "./Header.css";
import CTA from "./CTA";
import ME from "../../assets/cuted.png";
import Socials from "./Socials";

function Header() {
  return (
    <header>
      <div className="container header__container">
        <h5> Hello I'm</h5>
        <h1>Edher Diaz</h1>
        <h5 className="text-light">Energy Engineer</h5>
        <CTA />
        <Socials />
        <div className="me">
          <img src={ME} alt="me" />
        </div>
        <a href="#contact" className="scroll__down">
          Scroll Down
        </a>
      </div>
    </header>
  );
}

export default Header;

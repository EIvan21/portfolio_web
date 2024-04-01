import React from "react";
import { BsLinkedin, BsGithub } from "react-icons/bs";
import { TfiYoutube } from "react-icons/tfi";

function Socials() {
  return (
    <div className="header__socials">
      <a
        href="https://www.linkedin.com/in/edherdiaz/"
        target="_blank"
        rel="noreferrer"
      >
        <BsLinkedin />
      </a>
      <a href="https://github.com/edher21" target="_blank" rel="noreferrer">
        <BsGithub />
      </a>
      <a
        href="https://www.youtube.com/channel/UCZXTLimJvnbgn1Eu8Vu7wmA"
        target="_blank"
        rel="noreferrer"
      >
        <TfiYoutube />
      </a>
    </div>
  );
}

export default Socials;

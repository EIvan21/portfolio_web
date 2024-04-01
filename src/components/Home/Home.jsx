import React from "react";
import Header from "../Header/Header";

import Nav from "../Nav/Nav";
import About from "../About/About";
import Experience from "../Experience/Experience";
import Portfolio from "../Portfolio/Portfolio";
import Contact from "../Contacts/Contact";
import Footer from "../Footer/Footer";

const Home = () => {
  return (
    <>
      <Header />
      <Nav />
      <About />
      <Experience />
      <Portfolio />
      <Contact />
      <Footer />
    </>
  );
};

export default Home;

import React from "react";
import "./About.css";
import ME from "../../assets/biblio.png";
import { FaAward } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { VscFolderLibrary } from "react-icons/vsc";
import { MdOutlineSchool } from "react-icons/md";

function About() {
  return (
    <section id="about">
      <h5>Get To Know</h5>
      <h2>About Me</h2>
      <div className="container about__container">
        <div className="about__me">
          <div className="about__me-image">
            <img src={ME} alt="About me" />
          </div>
        </div>

        <div className="about__content">
          <div className="about__cards">
            <article className="about__card">
              <FaAward className="about__icon" />
              <h5> Experience</h5>
              <small>1+ Year working</small>
            </article>

            <article className="about__card">
              <MdOutlineSchool className="about__icon" />
              <h5> Background</h5>
              <small>
                <ul>
                  <li>Energy Engineer</li>
                  <li>Data analytics</li>
                  <li>Data Science</li>
                </ul>
              </small>
            </article>

            <article className="about__card">
              <VscFolderLibrary className="about__icon" />
              <h5> Projects</h5>
              <small>Google, Courses</small>
            </article>
          </div>

          <p>
            Graduated as Energy Engineer I never stopped learning new
            technologies and new tendences, in this last 2 years I have learned
            to code in python for Data Analytics and Data Science topics, I'm
            currently working at one of the most important companies in the
            world Google, there I have applied all my knowlege in Database
            Managment and Data Analysis to solve issues for the Google
            customers, and the application development. 
          </p>
          <p>
            Also I have a Diploma in Data Science where I applied all the knowledge acquired in the program in a <a href="https://www.kaggle.com/code/edherivndazsalazar/an-lisis-del-precio-marginal-local-en-el-mem-1" target="_blank" >final project</a> analyzing and predicting energy prices in the Wholesale Electricity Market in Mexico
          </p>
          <a href="#contact" className="btn btn-primary">
            Let's Talk
          </a>
        </div>
      </div>
    </section>
  );
}

export default About;

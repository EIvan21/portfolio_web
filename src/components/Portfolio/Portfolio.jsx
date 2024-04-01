import React from "react";
import "./Portfolio.css";

import data from "./Notebooks";
import { Link } from "react-router-dom";

function Portfolio() {
  return (
    <section id="portfolio">
      <h5>My Recent Work</h5>
      <h2>Potfolio</h2>

      <div className="container portfolio__container">
        {data.map(({ id, image, title, kaggle, notebookId }) => {
          return (
            <article key={id} className="portfolio__item">
              <div className="portfolio__item-image">
                <img src={image} alt={title} className="project-image" />
              </div>
              <h3>{title}</h3>
              <div className="portfolio__item-cta">
                <Link
                  to={`https://www.kaggle.com/code/edherivndazsalazar/${notebookId}`}
                  className="btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  Kaggle
                </Link>
                {/* <Link
                  to={`/blogprojects/${notebookId}`}
                  className="btn"
                  target="_blank"
                  rel="noreferrer"
                >
                  Blog Project
                </Link> */}
                {/* <Link
                  to={`/projects/${notebookId}`}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Project
                </Link> */}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Portfolio;

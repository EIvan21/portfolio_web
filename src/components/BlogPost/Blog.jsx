import React from "react";
import { useParams } from "react-router-dom";
import data from "../Portfolio/Notebooks";
import Cell from "./Cell";
import "./Blog.css";

const Blog = () => {
  const { projectid } = useParams();
  const noteBook = data.filter((notebook) => {
    return notebook.notebookId === projectid;
  });

  const graphs = noteBook[0].cellsGraphs.map((cell, index) => (
    <div>
      <h1>Visualization {index + 1}</h1>
      <br />
      <Cell
        notebookId={noteBook[0].notebookId}
        kernelSession={noteBook[0].kernelSessionId}
        cells={cell}
        key={index}
      />
      <br />
    </div>
  ));
  console.log(noteBook[0].cellsGraphs);

  return (
    <div className="container blog__container">
      <div className="title">
        <Cell
          notebookId={noteBook[0].notebookId}
          kernelSession={noteBook[0].kernelSessionId}
          cells="1"
        />
      </div>

      <h1>Overview</h1>

      <div className="overview">
        <Cell
          notebookId={noteBook[0].notebookId}
          kernelSession={noteBook[0].kernelSessionId}
          cells="3"
        />
      </div>

      <h1>Objectives</h1>

      <div className="objectives">
        <Cell
          notebookId={noteBook[0].notebookId}
          kernelSession={noteBook[0].kernelSessionId}
          cells="5-6"
        />
      </div>

      <h1>Results</h1>

      <div className="results">{graphs}</div>

      <h1>Conclusion</h1>
      <div className="conclusion">
        <Cell
          notebookId={noteBook[0].notebookId}
          kernelSession={noteBook[0].kernelSessionId}
          cells={noteBook[0].cellsConclusion}
        />
      </div>
    </div>
  );
};

export default Blog;


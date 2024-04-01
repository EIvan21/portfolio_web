import React from "react";
import NoteBook from "../NoteBook/NoteBook";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

import data from "./Notebooks";

const Projecto = () => {
  const { projectid } = useParams();
  const noteBook = data.filter((notebook) => {
    return notebook.notebookId === projectid;
  });
  return (
    <div className="container project__container">
      <NoteBook
        notebookId={noteBook[0].notebookId}
        kernelSession={noteBook[0].kernelSessionId}
      />
      <Link
          to={`/dashboard/${noteBook[0].notebookId}`}
          className="btn btn-primary"
          target="_blank"
          rel="noreferrer"
          >
          Dashboard
        </Link>

    </div>
  );
};

export default Projecto;

import React from "react";
import "./NoteBook.css";

function NoteBook({ notebookId, kernelSessionId }) {
  const url = "https://www.kaggle.com/embed/edherivndazsalazar/";

  return (
    <div className="iframe-container">
      <iframe
        src={url + notebookId + "?kernelSessionId=" + kernelSessionId}
        title="Kaggle Notebook"
        className="notebook"
      />
    </div>
  );
}

export default NoteBook;

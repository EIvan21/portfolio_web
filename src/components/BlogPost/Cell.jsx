import React from "react";

function Cell({ notebookId, kernelSessionId, cells }) {
  const url = "https://www.kaggle.com/embed/edherivndazsalazar/";

  return (
    <div className="iframe-container-blog">
      <iframe
        src={
          url +
          notebookId +
          "?cellIds=" +
          cells +
          "&kernelSessionId=" +
          kernelSessionId
        }
      />
    </div>
  );
}

export default Cell;

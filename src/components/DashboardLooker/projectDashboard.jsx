import React from "react";
import Dashboard from "./Dashboard";
import { useParams } from "react-router-dom";
// import { Link } from "react-router-dom";

import data from "../Portfolio/Notebooks";

const ProjectDashboard = () => {
  const { projectid } = useParams();
  const noteBook = data.filter((notebook) => {
    return notebook.notebookId === projectid;
  });

  console.log(noteBook[0].dashboardURL)
  return (
    <div className="container project__dashboard">
      <Dashboard
        notebookId = {noteBook[0].notebookId}
        dashboardURL = {noteBook[0].dashboardURL}
        className = "Dashboard"
      />
      
    </div>
  );
};

export default ProjectDashboard;

import React from "react";
import "./Dashboard.css";


function Dashbaord({ dashboardURL }) {
   
  
    return (
      <div className="iframe-container">
        <iframe
          src= {dashboardURL}
          title="Dashboard"
          className="dashbaord"
          height={2500}
          width={1600}
        />
      </div>
    );
  }
  
  export default Dashbaord;
  

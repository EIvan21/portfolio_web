import React from "react";
import Home from "./components/Home/Home";
import { Route, Routes } from "react-router-dom";
import Portfolio from "./components/Portfolio/Portfolio";
import Projecto from "./components/Portfolio/Proyecto";
import Blog from "./components/BlogPost/Blog";
import ProjectDashboard from "./components/DashboardLooker/projectDashboard.jsx";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/projects/:projectid" element={<Projecto />} />
        <Route path="/blogprojects/:projectid" element={<Blog />} />
        <Route path="/dashboard/:projectid" element={<ProjectDashboard />} />
      </Routes>
    </>
  );
};

export default App;

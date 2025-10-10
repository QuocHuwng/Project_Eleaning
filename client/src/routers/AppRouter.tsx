import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ManagerLesson from "../components/ManagerLesson";
import ManagerSubject from "../components/ManagerSubject";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/manager/lesson" element={<ManagerLesson />} />
        <Route path="/manager/subject" element={<ManagerSubject />} />
      </Routes>
    </Router>
  );
}

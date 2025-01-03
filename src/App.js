import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import CoursesPage from "./pages/CoursesPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import TeachPage from "./pages/TeachPage";
import CreateCoursePage from "./pages/CreateCoursePage"
import UserInfoPage from "./pages/AboutMePage";
import AboutPage from "./pages/AboutPage";
import { auth } from "./auth";
import "./styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import EditCoursePage from "./pages/EditCoursePage";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = auth.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route
          path="/courses/my"
          element={
            <PrivateRoute>
              <MyCoursesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/teach"
          element={
            <PrivateRoute>
              <TeachPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/teach/create-course"
          element={
            <PrivateRoute>
              <CreateCoursePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/userprofile"
          element={
            <PrivateRoute>
              <UserInfoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/teach/edit-course/:id"
          element={
            <PrivateRoute>
              <EditCoursePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

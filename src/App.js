import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateCoursePage from "./pages/CreateCoursePage"
import UserInfoPage from "./pages/AboutMePage";
import "./styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("accessToken"); // Проверяем наличие токена
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/create_course"
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
        </Routes>
    </Router>
  );
};

export default App;

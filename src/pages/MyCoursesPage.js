import React from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth } from "../auth";

const MyCoursesPage = () => {
  const isAuthenticated = auth.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ backgroundColor: "#F7F3EF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div className="container flex-grow-1 py-5">
        <h1 style={{ color: "#5A3E36" }}>Мои курсы</h1>
        {/* Add my courses content here */}
      </div>
      <Footer />
    </div>
  );
};

export default MyCoursesPage;
import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const TeachPage = () => {
  return (
    <div style={{ backgroundColor: "#F7F3EF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div className="container flex-grow-1 py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 style={{ color: "#5A3E36" }}>Преподавание</h1>
          <Link to="/teach/create-course">
            <button
              className="btn"
              style={{ backgroundColor: "#5A3E36", color: "#fff", borderRadius: "5px", border: "none" }}
            >
              Добавить курс
            </button>
          </Link>
        </div>
        {/* Add your teaching content here */}
      </div>
      <Footer />
    </div>
  );
};

export default TeachPage; 
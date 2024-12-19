import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";  // Импортируем Header
import Footer from "../components/Footer";  // Импортируем Footer

const Home = () => {
  return (
    <div style={{ backgroundColor: "#F7F3EF" }}>
      <Header /> {/* Вставляем Header */}
      <div className="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
        <h1 className="mb-4" style={{ color: "#5A3E36" }}>Добро пожаловать в EduFlex!</h1>
        <p className="mb-4" style={{ color: "#7A6A63" }}>
          Выберите действие, чтобы начать свое обучение.
        </p>
        <div>
          <Link to="/login">
            <button
              className="btn btn-primary me-3 px-4 py-2"
              style={{ backgroundColor: "#5A3E36", border: "none" }}
            >
              Войти
            </button>
          </Link>
          <Link to="/register">
            <button
              className="btn btn-secondary px-4 py-2"
              style={{ backgroundColor: "#D2C4B3", border: "none", color: "#5A3E36" }}
            >
              Зарегистрироваться
            </button>
          </Link>
        </div>
      </div>
      <Footer /> {/* Вставляем Footer */}
    </div>
  );
};

export default Home;

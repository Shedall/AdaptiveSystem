import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header
      style={{
        backgroundColor: "#fff",
        padding: "15px 30px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        {/* Левая часть хедера (логотип и кнопки) */}
        <div className="d-flex align-items-center">
          <img
            src="path-to-your-logo.png" // Замените на путь к вашему логотипу
            alt="Логотип компании"
            style={{
              width: "40px", // Размер логотипа
              marginRight: "10px",
            }}
          />
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "24px",
              color: "#5A3E36",
              margin: 0,
            }}
          >
            EduFlex
          </h1>
        </div>
        
        {/* Кнопки в хедере слева, рядом с названием */}
        <div className="d-flex align-items-center">
          <Link
            to="/courses"
            className="btn btn-link"
            style={{
              color: "#5A3E36",
              textDecoration: "none",
              marginRight: "15px",
            }}
          >
            Каталог курсов
          </Link>
          <Link
            to="/about"
            className="btn btn-link"
            style={{
              color: "#5A3E36",
              textDecoration: "none",
              marginRight: "15px",
            }}
          >
            О нас
          </Link>
        </div>

        {/* Правая часть хедера (кнопки входа и регистрации) */}
        <div>
          <Link
            to="/login"
            className="btn btn-primary me-3 px-4 py-2"
            style={{ backgroundColor: "#5A3E36", border: "none" }}
          >
            Войти
          </Link>
          <Link
            to="/register"
            className="btn btn-secondary px-4 py-2"
            style={{ backgroundColor: "#D2C4B3", border: "none", color: "#5A3E36" }}
          >
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

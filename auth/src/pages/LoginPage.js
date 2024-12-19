import React from "react";
import Login from "../components/Login";
import "../styles/Login.css";

const LoginPage = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh", // Высота контейнера на весь экран
        backgroundColor: "#f9f4ef",
        padding: "20px", // Отступы для мобильных экранов
      }}
    >
      <div
        className="shadow-lg p-5"
        style={{
          backgroundColor: "#fff",
          width: "1000px", // Увеличенная ширина
          maxWidth: "100%", // Для адаптивности
          borderRadius: "10px",
        }}
      >
        <h2
          className="text-center mb-4"
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "28px",
            color: "#5A3E36",
          }}
        >
          Вход
        </h2>
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;

import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth } from "../auth";

const Home = () => {
  const userData = auth.getUserData();
  const isAuthenticated = auth.isAuthenticated();

  return (
    <div style={{ backgroundColor: "#F7F3EF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%"
        }}
      >
        {isAuthenticated ? (
          <div className="text-center">
            <h1 style={{ color: "#5A3E36", marginBottom: "1rem" }}>
              Добро пожаловать, {userData?.fio}!
            </h1>
            <p style={{ color: "#7A6A63", fontSize: "1.25rem", marginBottom: "2rem" }}>
              Давайте начнем обучение
            </p>
            <Link
              to="/courses"
              className="btn"
              style={{
                backgroundColor: "#5A3E36",
                color: "#fff",
                padding: "10px 30px",
                fontSize: "1.1rem"
              }}
            >
              Смотреть курсы
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <h1 style={{ color: "#5A3E36", marginBottom: "1rem" }}>
              Добро пожаловать в EduFlex!
            </h1>
            <p style={{ color: "#7A6A63", fontSize: "1.25rem", marginBottom: "2rem" }}>
              Присоединяйтесь к нашей образовательной платформе
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Link
                to="/login"
                className="btn"
                style={{
                  backgroundColor: "#5A3E36",
                  color: "#fff",
                  padding: "10px 30px",
                  fontSize: "1.1rem"
                }}
              >
                Войти
              </Link>
              <Link
                to="/register"
                className="btn"
                style={{
                  backgroundColor: "#D2C4B3",
                  color: "#5A3E36",
                  padding: "10px 30px",
                  fontSize: "1.1rem"
                }}
              >
                Регистрация
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;

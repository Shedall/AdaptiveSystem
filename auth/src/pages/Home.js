import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="container">
      <h1>Добро пожаловать!</h1>
      <p>Выберите действие:</p>
      <div>
        <Link to="/login">
          <button>Войти</button>
        </Link>
        <Link to="/register" style={{ marginLeft: "10px" }}>
          <button>Зарегистрироваться</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

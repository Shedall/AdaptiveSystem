import React from "react";
import Login from "../components/Login";
import "../styles/Login.css";

const LoginPage = () => {
  return (
    <div className="container">
      <h2>Вход</h2>
      <Login />
    </div>
  );
};

export default LoginPage;

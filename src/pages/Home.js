import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div style={{ backgroundColor: "#F7F3EF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div className="container flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center">
        <h1 className="mb-4" style={{ color: "#5A3E36" }}>Добро пожаловать в EduFlex!</h1>
        <p className="mb-4" style={{ color: "#7A6A63" }}>
          Выберите действие, чтобы начать свое обучение.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default Home;

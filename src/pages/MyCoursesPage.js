import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MyCoursesPage = () => {
  return (
    <div style={{ backgroundColor: "#F7F3EF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{
        flex: "1",
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%"
      }}>
        <h1 style={{ color: "#5A3E36", marginBottom: "1.5rem" }}>Мои курсы</h1>

        <div className="text-center p-5" style={{ color: "#5A3E36" }}>
          <p className="mb-4">У вас пока нет курсов. Перейдите в каталог, чтобы записаться на интересующий вас курс.</p>
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
            Перейти в каталог
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyCoursesPage;
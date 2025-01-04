import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "../auth";
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = auth.isAuthenticated();
  const userData = auth.getUserData();

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  const isProfilePage = location.pathname === "/userprofile";

  const profileSection = (
    <Link
      to="/userprofile"
      className="d-flex align-items-center text-decoration-none"
      style={{
        color: isProfilePage ? "#fff" : "#D2C4B3",
        padding: "6px 12px",
        borderRadius: "4px",
        fontWeight: isProfilePage ? "500" : "normal"
      }}
    >
      <span className="me-2">{userData?.fio}</span>
      {userData?.image && (
        <img
          src={userData.image}
          alt="User Avatar"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover"
          }}
        />
      )}
    </Link>
  );

  const authButtons = (
    <>
      <Link
        to="/login"
        className="btn me-2"
        style={{ backgroundColor: "#D2C4B3", color: "#5A3E36" }}
      >
        Войти
      </Link>
      <Link
        to="/register"
        className="btn"
        style={{ backgroundColor: "#D2C4B3", color: "#5A3E36" }}
      >
        Регистрация
      </Link>
    </>
  );

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="header-wrapper">
        <Link className="navbar-brand" to="/" style={{ color: "#fff", fontWeight: "600" }}>
          EduFlex
        </Link>
        {isAuthenticated && (
          <div className="d-flex d-lg-none align-items-center">
            {profileSection}
          </div>
        )}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/courses"
                style={{
                  color: location.pathname === '/courses' ? "#fff" : "#D2C4B3",
                  fontWeight: location.pathname === '/courses' ? "500" : "normal"
                }}
              >
                Каталог курсов
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/courses/my"
                    style={{
                      color: location.pathname === '/courses/my' ? "#fff" : "#D2C4B3",
                      fontWeight: location.pathname === '/courses/my' ? "500" : "normal"
                    }}
                  >
                    Мои курсы
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/teach"
                    style={{
                      color: location.pathname === '/teach' ? "#fff" : "#D2C4B3",
                      fontWeight: location.pathname === '/teach' ? "500" : "normal"
                    }}
                  >
                    Преподавание
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/about"
                style={{
                  color: location.pathname === '/about' ? "#fff" : "#D2C4B3",
                  fontWeight: location.pathname === '/about' ? "500" : "normal"
                }}
              >
                О нас
              </Link>
            </li>
          </ul>
          <div className="d-none d-lg-flex align-items-center">
            {isAuthenticated ? profileSection : authButtons}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;

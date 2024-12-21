import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../auth';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem('userData'));
  const isAuthenticated = localStorage.getItem('accessToken');

  const [showLogoutModal, setShowLogoutModal] = useState(false); // Для управления модальным окном

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const linkStyle = (path) => ({
    color: '#5A3E36',
    textDecoration: 'none',
    borderBottom: isActivePath(path) ? '2px solid #5A3E36' : 'none',
    paddingBottom: '3px',
  });

  // Проверяем, находится ли пользователь на страницах /login или /register
  const isAuthOrRegisterPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      <header className="shadow-sm" style={{ backgroundColor: '#fff' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-3">
            <div className="d-flex align-items-center">
              <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 className="m-0 me-4" style={{ color: '#5A3E36', fontSize: '24px' }}>EduFlex</h1>
              </Link>

              {/* Navigation Links */}
              <nav className="d-flex align-items-center">
                <Link
                  to="/courses"
                  className="me-3"
                  style={linkStyle('/courses')}
                >
                  Каталог курсов
                </Link>
                <Link
                  to="/about"
                  className="me-3"
                  style={linkStyle('/about')}
                >
                  О нас
                </Link>
                {isAuthenticated && (
                  <>
                    <Link
                      to="/courses/my"
                      className="me-3"
                      style={linkStyle('/courses/my')}
                    >
                      Мои курсы
                    </Link>
                    <Link
                      to="/teach"
                      style={linkStyle('/teach')}
                    >
                      Преподавание
                    </Link>
                  </>
                )}
              </nav>
            </div>

            <div className="d-flex align-items-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/userprofile"
                    className="d-flex align-items-center me-3"
                    style={{
                      textDecoration: 'none',
                      borderBottom: isActivePath('/userprofile') ? '2px solid #5A3E36' : 'none',
                      paddingBottom: '3px',
                    }}
                  >
                    {userData?.image && (
                      <img
                        src={userData.image}
                        alt="Фото профиля"
                        className="rounded-circle me-2"
                        style={{ width: "40px", height: "40px", objectFit: "cover", cursor: "pointer" }}
                      />
                    )}
                    <span style={{ color: '#5A3E36', cursor: "pointer" }}>{userData?.fio}</span>
                  </Link>
                  <button
                    onClick={() => setShowLogoutModal(true)} // Открываем модальное окно
                    className="btn"
                    style={{ backgroundColor: "#D2C4B3", color: "#5A3E36", borderRadius: "5px", border: "none" }}
                  >
                    Выйти
                  </button>
                </>
              ) : (
                // Скрываем кнопки "Войти" и "Регистрация" на страницах /login и /register
                !isAuthOrRegisterPage && (
                  <div>
                    <Link to="/login">
                      <button
                        className="btn me-2"
                        style={{ backgroundColor: "#5A3E36", color: "#fff", borderRadius: "5px", border: "none" }}
                      >
                        Войти
                      </button>
                    </Link>
                    <Link to="/register">
                      <button
                        className="btn"
                        style={{ backgroundColor: "#D2C4B3", color: "#5A3E36", borderRadius: "5px", border: "none" }}
                      >
                        Регистрация
                      </button>
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Модальное окно для подтверждения выхода */}
      {showLogoutModal && (
        <div
          className="modal d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
        >
          <div
            className="modal-content p-4"
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              width: "400px",
              textAlign: "center",
            }}
          >
            <h5 style={{ marginBottom: "20px" }}>Вы действительно хотите выйти?</h5>
            <div className="d-flex justify-content-between">
              <button
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ width: "45%" }}
              >
                Да, хочу выйти
              </button>
              <button
                onClick={() => setShowLogoutModal(false)} // Закрываем окно
                className="btn btn-secondary"
                style={{ width: "45%" }}
              >
                Нет, остаюсь
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

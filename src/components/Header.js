import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../auth';

const Header = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData'));
  const isAuthenticated = localStorage.getItem('accessToken');

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  return (
    <header className="shadow-sm" style={{ backgroundColor: '#fff' }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center py-3">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 className="m-0" style={{ color: '#5A3E36', fontSize: '24px' }}>EduFlex</h1>
          </Link>

          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <>
                <div className="d-flex align-items-center me-3">
                  {userData?.image && (
                    <img
                      src={userData.image}
                      alt="Фото профиля"
                      className="rounded-circle me-2"
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    />
                  )}
                  <span style={{ color: '#5A3E36' }}>{userData?.fio}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn"
                  style={{ backgroundColor: "#D2C4B3", color: "#5A3E36", borderRadius: "5px", border: "none" }}
                >
                  Выйти
                </button>
              </>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

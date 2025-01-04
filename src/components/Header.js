import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../auth';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem('userData'));
  const isAuthenticated = localStorage.getItem('accessToken');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const isActivePath = (path) => location.pathname === path;
  const isAuthOrRegisterPage = location.pathname === '/login' || location.pathname === '/register';

  const linkStyle = (path) => ({
    color: '#5A3E36',
    textDecoration: 'none',
    borderBottom: isActivePath(path) ? '2px solid #5A3E36' : 'none',
    paddingBottom: '3px',
    whiteSpace: 'nowrap'
  });

  const renderNavLinks = () => (
    <>
      <Link to="/courses" className="me-3" style={linkStyle('/courses')}>
        Каталог курсов
      </Link>
      <Link to="/about" className="me-3" style={linkStyle('/about')}>
        О нас
      </Link>
      {isAuthenticated && (
        <>
          <Link to="/courses/my" className="me-3" style={linkStyle('/courses/my')}>
            Мои курсы
          </Link>
          <Link to="/teach" style={linkStyle('/teach')}>
            Преподавание
          </Link>
        </>
      )}
    </>
  );

  return (
    <>
      <header style={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #eee',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '15px 20px',
          width: '100%'
        }}>
          <div className="d-flex justify-content-between align-items-center" style={{ minHeight: '50px' }}>
            <div className="d-flex align-items-center">
              <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 className="m-0 me-4" style={{
                  color: '#5A3E36',
                  fontSize: '24px',
                  lineHeight: '1.2'
                }}>EduFlex</h1>
              </Link>

              {!isMobile && <nav className="d-flex align-items-center">{renderNavLinks()}</nav>}

              {isMobile && (
                <button
                  className="btn"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    padding: '8px 12px',
                    lineHeight: '1'
                  }}
                >
                  ☰
                </button>
              )}
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
                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                      />
                    )}
                    {!isMobile && <span style={{ color: '#5A3E36' }}>{userData?.fio}</span>}
                  </Link>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="btn"
                    style={{ backgroundColor: "#D2C4B3", color: "#5A3E36", border: "none" }}
                  >
                    {isMobile ? "×" : "Выйти"}
                  </button>
                </>
              ) : (
                !isAuthOrRegisterPage && (
                  <div>
                    <Link to="/login">
                      <button className="btn me-2" style={{ backgroundColor: "#5A3E36", color: "#fff", border: "none" }}>
                        {isMobile ? "→" : "Войти"}
                      </button>
                    </Link>
                    {!isMobile && (
                      <Link to="/register">
                        <button className="btn" style={{ backgroundColor: "#D2C4B3", color: "#5A3E36", border: "none" }}>
                          Регистрация
                        </button>
                      </Link>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobile && isMobileMenuOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: '#fff',
              padding: '15px 20px',
              borderTop: '1px solid #eee',
              zIndex: 1000,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <nav className="d-flex flex-column gap-3">
                {renderNavLinks()}
                {!isAuthenticated && !isAuthOrRegisterPage && (
                  <Link to="/register" style={linkStyle('/register')}>
                    Регистрация
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Logout Modal - unchanged */}
      {showLogoutModal && (
        <div className="modal d-flex justify-content-center align-items-center"
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
          <div className="modal-content p-4"
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              width: isMobile ? "90%" : "400px",
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
                onClick={() => setShowLogoutModal(false)}
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

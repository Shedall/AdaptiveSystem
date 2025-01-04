import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { userService } from "../api";
import { auth } from "../auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await userService.login(formData);
      if (!response) {
        throw new Error('Нет ответа от сервера');
      }

      auth.login(response.token, response.user);

      if (!auth.isAuthenticated()) {
        throw new Error('Ошибка авторизации');
      }

      navigate("/");
    } catch (error) {
      setError(error.detail || error.message || "Ошибка при входе");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#F7F3EF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{
        flex: "1",
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div className="col-lg-6">
          <h1 style={{ color: "#5A3E36", marginBottom: "1.5rem", textAlign: "center" }}>Вход</h1>

          <div className="card border-0" style={{ backgroundColor: "white", borderRadius: "15px" }}>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" style={{ color: "#5A3E36" }}>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label" style={{ color: "#5A3E36" }}>Пароль</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn w-100 mb-3"
                  style={{ backgroundColor: "#5A3E36", color: "#fff" }}
                  disabled={isLoading}
                >
                  {isLoading ? "Вход..." : "Войти"}
                </button>

                <div className="text-center" style={{ color: "#7A6A63" }}>
                  Нет аккаунта?{" "}
                  <Link to="/register" style={{ color: "#5A3E36" }}>
                    Зарегистрироваться
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;

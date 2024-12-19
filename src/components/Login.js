import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", formData);
      setSuccess("Вы успешно вошли!");
      console.log("Ответ сервера:", response.data);
    } catch (error) {
      setError(error.response?.data?.detail || "Ошибка входа. Проверьте данные и попробуйте снова.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">Вход</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Имя пользователя:</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ borderRadius: "5px", border: "1px solid #D2C4B3" }}
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />

                </div>
                <div className="mb-3">
                  <label className="form-label">Пароль:</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn w-100"
                  style={{ backgroundColor: "#5A3E36", color: "#fff", borderRadius: "5px", border: "none" }}
                >
                  Войти
                </button>

              </form>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
              {success && <div className="alert alert-success mt-3">{success}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

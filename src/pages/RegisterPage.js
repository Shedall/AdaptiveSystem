import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { userService } from "../api";
import { auth } from "../auth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fio: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('fio', formData.fio);
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await userService.register(data);
      auth.login(response.token, response.user);
      navigate("/");
    } catch (error) {
      setError(error.detail || "Ошибка при регистрации");
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
          <h1 style={{ color: "#5A3E36", marginBottom: "1.5rem", textAlign: "center" }}>Регистрация</h1>

          <div className="card border-0" style={{ backgroundColor: "white", borderRadius: "15px" }}>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4 text-center">
                  {(imagePreview || formData.image) && (
                    <img
                      src={imagePreview || "/avatar-placeholder.png"}
                      alt="Profile"
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginBottom: "1rem"
                      }}
                    />
                  )}
                  <div>
                    <input
                      type="file"
                      id="image"
                      className="d-none"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="image"
                      className="btn"
                      style={{ backgroundColor: "#D2C4B3", color: "#5A3E36" }}
                    >
                      {imagePreview ? "Изменить фото" : "Добавить фото"}
                    </label>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label" style={{ color: "#5A3E36" }}>ФИО</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fio"
                    value={formData.fio}
                    onChange={handleInputChange}
                    required
                  />
                </div>

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

                <div className="mb-3">
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

                <div className="mb-4">
                  <label className="form-label" style={{ color: "#5A3E36" }}>Подтверждение пароля</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={formData.confirmPassword}
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
                  {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                </button>

                <div className="text-center" style={{ color: "#7A6A63" }}>
                  Уже есть аккаунт?{" "}
                  <Link to="/login" style={{ color: "#5A3E36" }}>
                    Войти
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

export default RegisterPage;

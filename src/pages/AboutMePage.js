import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth } from "../auth";
import { userService } from "../api";

const AboutMePage = () => {
  const navigate = useNavigate();
  const userData = auth.getUserData();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    fio: userData?.fio || "",
    old_password: "",
    new_password: "",
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);

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
    setSuccess("");
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('fio', formData.fio);

      // Only append password fields if both are filled
      if (formData.old_password && formData.new_password) {
        data.append('old_password', formData.old_password);
        data.append('new_password', formData.new_password);
      } else if (formData.old_password || formData.new_password) {
        // If only one password field is filled, show error
        setError("Для смены пароля необходимо заполнить оба поля");
        setIsLoading(false);
        return;
      }

      // Only append image if it was changed
      if (formData.image) {
        data.append('image', formData.image);
      }

      const response = await userService.updateProfile(data);
      auth.updateUserData(response);
      setSuccess("Профиль успешно обновлен");
      setFormData(prev => ({
        ...prev,
        old_password: "",
        new_password: ""
      }));
    } catch (error) {
      console.log(error);
      setError(error.detail || "Ошибка при обновлении профиля");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

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
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 style={{ color: "#5A3E36", marginBottom: "0" }}>Мой профиль</h1>
              <button
                onClick={handleLogout}
                className="btn"
                style={{
                  backgroundColor: "#D2C4B3",
                  color: "#5A3E36",
                  minWidth: "120px"
                }}
              >
                Выйти
              </button>
            </div>

            <div className="card border-0" style={{ backgroundColor: "white", borderRadius: "15px" }}>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger mb-4">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="alert alert-success mb-4">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4 text-center">
                    <img
                      src={imagePreview || userData?.image || "/avatar-placeholder.png"}
                      alt="Profile"
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginBottom: "1rem"
                      }}
                    />
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
                        Изменить фото
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
                    <label className="form-label" style={{ color: "#5A3E36" }}>Старый пароль</label>
                    <input
                      type="password"
                      className="form-control"
                      name="old_password"
                      value={formData.old_password}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label" style={{ color: "#5A3E36" }}>Новый пароль</label>
                    <input
                      type="password"
                      className="form-control"
                      name="new_password"
                      value={formData.new_password}
                      onChange={handleInputChange}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn w-100"
                    style={{ backgroundColor: "#5A3E36", color: "#fff" }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Сохранение..." : "Сохранить изменения"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutMePage;

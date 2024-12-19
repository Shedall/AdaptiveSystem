import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({ fio: "", email: "", password: "", image: null });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formDataToSend = new FormData();
    formDataToSend.append("fio", formData.fio);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    if (formData.image) formDataToSend.append("image", formData.image);

    try {
      const response = await axios.post("http://localhost:8000/api/auth/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Вы успешно зарегистрировались!");
      console.log("Ответ сервера:", response.data);
    } catch (error) {
      setError(error.response?.data?.email || "Ошибка регистрации. Проверьте данные и попробуйте снова.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">Регистрация</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">ФИО:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fio"
                    value={formData.fio}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Почта:</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
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
                <div className="mb-3">
                  <label className="form-label">Изображение (необязательно):</label>
                  <input type="file" className="form-control" onChange={handleFileChange} />
                </div>
                <button type="submit" className="btn btn-success w-100">Зарегистрироваться</button>
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

export default Register;

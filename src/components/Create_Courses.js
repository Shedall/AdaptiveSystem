import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../api"; // Предполагается, что вы используете отдельный модуль для API-запросов.

const CreateCourse = () => {
  const navigate = useNavigate();

  // Управление состоянием данных формы
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    category: null,
  });

  // Управление состоянием ошибок, успешного создания и загрузки
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Обработчик изменения текстовых полей формы
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Обработчик изменения файла (изображения)
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Формируем данные для отправки
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    if (formData.image) formDataToSend.append("image", formData.image);
    if (formData.category) formDataToSend.append("category", formData.category);

    try {
      // Отправляем запрос на сервер через service
      const response = await userService.createCourse(formDataToSend);

      if (response.detail) {
        setError(response.detail);
        return;
      }

      setSuccess("Курс успешно создан!");
      setTimeout(() => {
        navigate("/"); // Перенаправляем на страницу списка курсов
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.detail || "Ошибка создания курса. Попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">Создание курса</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Название курса:</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ borderRadius: "5px", border: "1px solid #D2C4B3" }}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Описание:</label>
                  <textarea
                    className="form-control"
                    style={{ borderRadius: "5px", border: "1px solid #D2C4B3" }}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Изображение (необязательно):</label>
                  <input
                    type="file"
                    className="form-control"
                    style={{ borderRadius: "5px", border: "1px solid #D2C4B3" }}
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Категория (необязательно):</label>
                  <input
                    type="text"
                    className="form-control"
                    style={{ borderRadius: "5px", border: "1px solid #D2C4B3" }}
                    name="category"
                    value={formData.category || ""}
                    onChange={handleChange}
                  />
                </div>
                <button
                  type="submit"
                  className="btn w-100"
                  style={{ backgroundColor: "#5A3E36", color: "#fff", borderRadius: "5px", border: "none" }}
                  disabled={isLoading}
                >
                  {isLoading ? "Загрузка..." : "Создать курс"}
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

export default CreateCourse;

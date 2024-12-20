import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CourseService } from "../api";

const CreateCourse = () => {
  const navigate = useNavigate();

  // Управление состоянием данных формы
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    category: "",
  });

  // Добавляем состояние для категорий
  const [categories, setCategories] = useState([]);

  // Управление состоянием ошибок, успешного создания и загрузки
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Загрузка категорий при монтировании компонента
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CourseService.getCategories();
        setCategories(response.results);
      } catch (error) {
        setError("Ошибка при загрузке категорий");
      }
    };

    fetchCategories();
  }, []);

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
      const response = await CourseService.createCourse(formDataToSend);

      if (response.detail) {
        setError(response.detail);
        return;
      }

      setSuccess("Курс успешно создан!");
      setTimeout(() => {
        navigate("/teach"); // Перенаправляем на страницу списка курсов
      }, 2000);
    } catch (error) {
      setError(error);
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
                  <label className="form-label">Категория:</label>
                  <select
                    className="form-select"
                    style={{ borderRadius: "5px", border: "1px solid #D2C4B3" }}
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
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
              {error && (
                <div className="alert alert-danger">
                  {error.name && <p>Курс с таким названием уже существует</p>}
                  {error.description && <p>Ошибка в описании курса: Поле описания не может быть пустым</p>}
                  {error.detail && <p>{error.detail}</p>}
                </div>
              )}
              {success && <div className="alert alert-success mt-3">{success}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;

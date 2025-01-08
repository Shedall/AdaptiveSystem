import React, { useState, useEffect } from "react";
import { CourseService } from "../../api";

const CourseForm = ({ onSave, onCancel, initialData = null }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        description: initialData?.description || "",
        image: null,
        category: initialData?.category || "",
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description);
        if (formData.image) formDataToSend.append("image", formData.image);
        if (formData.category) formDataToSend.append("category", formData.category);

        onSave(formDataToSend);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Название курса:</label>
                <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Описание курса:</label>
                <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Изображение (необязательно):</label>
                <input
                    type="file"
                    className="form-control"
                    onChange={handleFileChange}
                    accept="image/*"
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Категория:</label>
                <select
                    className="form-select"
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
            {error && <div className="alert alert-danger mb-3">{error}</div>}
            <div className="d-flex gap-2">
                <button type="submit" className="btn" style={{ backgroundColor: "#5A3E36", color: "#fff" }}>
                    {initialData ? "Сохранить изменения" : "Создать курс"}
                </button>
                <button
                    type="button"
                    className="btn"
                    onClick={onCancel}
                    style={{ backgroundColor: "#D2C4B3", color: "#5A3E36" }}
                >
                    Отмена
                </button>
            </div>
        </form>
    );
};

export default CourseForm; 
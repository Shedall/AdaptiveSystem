import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CourseService } from "../api";
import Modal from "../components/Modal";
import CourseForm from "../components/course-edit/CourseForm";
import IconButton from "../components/IconButton";

const TeachPage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch both courses and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Reset error state
      try {
        const [coursesResponse, categoriesResponse] = await Promise.all([
          CourseService.getMyCourses(),
          CourseService.getCategories()
        ]);
        setCourses(coursesResponse.results);
        setCategories(categoriesResponse.results);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.detail || "Произошла ошибка при загрузке данных");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateCourse = async (formData) => {
    try {
      await CourseService.createCourse(formData);
      const updatedCourses = await CourseService.getMyCourses();
      setCourses(updatedCourses.results);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating course:', error);
      setError(error.detail || "Ошибка при создании курса");
    }
  };

  const handleDeleteCourse = async (courseId, event) => {

    event.preventDefault(); // Prevents the default behavior (navigation)
    event.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить этот курс?')) {
      try {
        // Вызов API для удаления курса
        await CourseService.deleteCourse(courseId);

        // Получение обновленного списка курсов после удаления
        const updatedCourses = await CourseService.getMyCourses();
        setCourses(updatedCourses.results); // Обновляем список курсов

      } catch (error) {
        console.error('Ошибка при удалении курса:', error);
        alert(error.detail || "Ошибка при удалении курса");
      }
    }
  };

  // Helper function to get category name by id
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : null;
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 style={{ color: "#5A3E36" }}>Преподавание</h1>
          <IconButton
            icon="add_icon.svg"
            text="Создать курс"
            onClick={() => setShowCreateModal(true)}
          />
        </div>

        {error && (
          <div className="alert alert-danger mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : courses.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {courses.map(course => (
              <div key={course.id} className="col">
                <Link
                  to={`/teach/edit-course/${course.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="card h-100">
                    <div className="row g-0 h-100">
                      <div className="col-4">
                        <img
                          src={course.image || '/placeholder.png'}
                          alt={course.name}
                          className="img-fluid rounded-start h-100"
                          style={{ objectFit: "cover" }}
                          onError={(e) => {
                            e.target.src = '/placeholder.png';
                          }}
                        />
                      </div>
                      <div className="col-8">
                        <div className="card-body d-flex flex-column h-100">
                          <div className="d-flex justify-content-between align-items-start">
                            <h5 className="card-title" style={{ color: "#5A3E36" }}>{course.name}</h5>
                            <span
                              className={`badge ${course.status === "Опубликован" ? "bg-success" : "bg-warning"}`}
                              style={{ fontSize: "0.8rem" }}
                            >
                              {course.status || 'Черновик'}
                            </span>
                          </div>
                          <p className="card-text text-muted mb-2">{course.description}</p>
                          <div className="mt-auto">
                            <small className="text-muted">
                              {getCategoryName(course.category) || 'Без категории'}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-5" style={{ color: "#5A3E36" }}>
            <p>У вас пока нет созданных курсов. Создайте свой первый курс, нажав кнопку "Создать курс".</p>
          </div>
        )}

        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Создать новый курс"
        >
          <CourseForm
            onSave={handleCreateCourse}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default TeachPage; 
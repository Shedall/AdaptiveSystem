import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CourseService } from "../api";

const CourseListItem = ({ course, categoryName }) => {
  return (
    <Link
      to={`/teach/edit-course/${course.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="card mb-3">
        <div className="row g-0 align-items-center">
          <div className="col-2">
            <img
              src={course.image || '/placeholder.png'}
              alt={course.name}
              className="img-fluid rounded-start"
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                padding: "10px"
              }}
              onError={(e) => {
                e.target.src = '/placeholder.png';
              }}
            />
          </div>
          <div className="col-10">
            <div className="card-body">
              <h5 className="card-title" style={{ color: "#5A3E36" }}>{course.name}</h5>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted">Категория: {categoryName || 'Без категории'}</span>
                </div>
                <span
                  className={`badge ${course.status === "Опубликован" ? "bg-success" : "bg-warning"
                    }`}
                >
                  {course.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const TeachPage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch both courses and categories
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
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

  // Helper function to get category name by id
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : null;
  };

  return (
    <div style={{ backgroundColor: "#F7F3EF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div className="container flex-grow-1 py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 style={{ color: "#5A3E36" }}>Преподавание</h1>
          <Link to="/teach/create-course">
            <button
              className="btn"
              style={{ backgroundColor: "#5A3E36", color: "#fff", borderRadius: "5px", border: "none" }}
            >
              Добавить курс
            </button>
          </Link>
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
          <div className="courses-list">
            {courses.map(course => (
              <CourseListItem
                key={course.id}
                course={course}
                categoryName={getCategoryName(course.category)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted">
            <p>У вас пока нет созданных курсов</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TeachPage; 
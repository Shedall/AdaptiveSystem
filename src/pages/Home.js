import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CourseCard from "../components/CourseCard";
import { CourseService } from "../api";
import { auth } from "../auth";

const Home = () => {
  const isAuthenticated = auth.isAuthenticated();
  const userData = auth.getUserData();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CourseService.getCategories();
        setCategories(response.results);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated]);

  // Fetch courses using debounced search
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await CourseService.getCourses(debouncedSearch, currentPage);
        setCourses(response.results);
        setTotalPages(Math.ceil(response.count / 10));
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error.detail || "Произошла ошибка при загрузке курсов");
        setCourses([]);
        setTotalPages(0);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCourses();
    }
  }, [debouncedSearch, currentPage, isAuthenticated]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      }
      return [...prev, categoryId];
    });
  };

  // Render pagination buttons
  const renderPagination = () => {
    return (
      <nav aria-label="Course pagination">
        <ul className="pagination justify-content-center">
          {[...Array(totalPages)].map((_, index) => (
            <li
              key={index + 1}
              className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => setCurrentPage(index + 1)}
                style={{
                  backgroundColor: currentPage === index + 1 ? '#5A3E36' : '#fff',
                  borderColor: '#D2C4B3',
                  color: currentPage === index + 1 ? '#fff' : '#5A3E36'
                }}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };

  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: "#F7F3EF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header />
        <div className="container flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center">
          <h1 className="mb-4" style={{ color: "#5A3E36" }}>Добро пожаловать в EduFlex!</h1>
          <p className="mb-4" style={{ color: "#7A6A63" }}>
            Выберите действие, чтобы начать свое обучение.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#F7F3EF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div className="container flex-grow-1 py-5">
        <h1 className="mb-4" style={{ color: "#5A3E36" }}>Добро пожаловать, {userData?.fio}!</h1>

        <div className="row">
          {/* Categories sidebar */}
          <div className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3" style={{ color: "#5A3E36" }}>Категории</h5>
                {categories.map(category => (
                  <div className="form-check mb-2" key={category.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`category-${category.id}`}
                      style={{ color: "#5A3E36" }}
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="col-md-9">
            {/* Search bar */}
            <div className="mb-4">
              <input
                type="text"
                className="form-control"
                placeholder="Поиск курсов..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ borderRadius: "5px", border: "1px solid #D2C4B3" }}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="alert alert-danger mb-4">
                {error}
              </div>
            )}

            {/* Courses grid */}
            {isLoading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {courses.length > 0 ? (
                  courses.map(course => (
                    <div className="col" key={course.id}>
                      <CourseCard course={course} />
                    </div>
                  ))
                ) : !error && (
                  <div className="col-12 text-center">
                    <p className="text-muted">Курсы не найдены</p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !isLoading && !error && (
              <div className="mt-4">
                {renderPagination()}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;

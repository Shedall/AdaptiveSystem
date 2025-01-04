import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CourseService } from "../api";
import CourseCard from "../components/CourseCard";

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [coursesResponse, categoriesResponse] = await Promise.all([
                    CourseService.getCourses(),
                    CourseService.getCategories()
                ]);
                setCourses(coursesResponse.results);
                setCategories(categoriesResponse.results);
            } catch (error) {
                setError("Ошибка при загрузке данных");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredCourses = selectedCategory === 'all'
        ? courses
        : courses.filter(course => course.category === parseInt(selectedCategory));

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
                <div className="mb-4">
                    <h1 style={{ color: "#5A3E36", marginBottom: "1.5rem" }}>Каталог курсов</h1>

                    <div className="d-flex gap-2 flex-wrap">
                        <button
                            className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setSelectedCategory('all')}
                            style={{
                                backgroundColor: selectedCategory === 'all' ? "#5A3E36" : "transparent",
                                borderColor: "#5A3E36",
                                color: selectedCategory === 'all' ? "#fff" : "#5A3E36"
                            }}
                        >
                            Все курсы
                        </button>
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`btn ${selectedCategory === category.id.toString() ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setSelectedCategory(category.id.toString())}
                                style={{
                                    backgroundColor: selectedCategory === category.id.toString() ? "#5A3E36" : "transparent",
                                    borderColor: "#5A3E36",
                                    color: selectedCategory === category.id.toString() ? "#fff" : "#5A3E36"
                                }}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
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
                ) : filteredCourses.length > 0 ? (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                        {filteredCourses.map(course => (
                            <div className="col" key={course.id}>
                                <CourseCard course={course} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-5" style={{ color: "#5A3E36" }}>
                        <p>В данной категории пока нет курсов</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CoursesPage;
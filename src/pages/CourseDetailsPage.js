import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CourseService } from "../api";
import LoadingScreen from "../components/LoadingScreen";

const CourseDetailsPage = () => {
    const { id } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const data = await CourseService.getCourseById(id);
                setCourseData(data);
            } catch (error) {
                setError(error.detail || "Ошибка при загрузке курса");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseData();
    }, [id]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <div style={{ backgroundColor: "#F7F3EF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <Header />
                <div className="container mt-4">
                    <div className="alert alert-danger">{error}</div>
                </div>
                <Footer />
            </div>
        );
    }

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
                <div className="row">
                    {/* Course Header */}
                    <div className="col-md-4 mb-4">
                        <img
                            src={courseData?.image || '/placeholder.png'}
                            alt={courseData?.name}
                            className="img-fluid rounded"
                            style={{ width: "100%", objectFit: "cover", aspectRatio: "1" }}
                            onError={(e) => {
                                e.target.src = '/placeholder.png';
                            }}
                        />
                    </div>
                    <div className="col-md-8 mb-4">
                        <div className="d-flex justify-content-between align-items-start">
                            <h1 style={{ color: "#5A3E36" }}>{courseData?.name}</h1>
                            <span
                                className={`badge ${courseData?.status === "Опубликован" ? "bg-success" : "bg-warning"}`}
                            >
                                {courseData?.status || 'Черновик'}
                            </span>
                        </div>
                        <p className="text-muted mb-4">{courseData?.description}</p>
                        {courseData?.category_name && (
                            <p><strong>Категория:</strong> {courseData.category_name}</p>
                        )}
                        <button
                            className="btn"
                            style={{
                                backgroundColor: "#5A3E36",
                                color: "#fff",
                                padding: "10px 30px",
                                fontSize: "1.1rem"
                            }}
                            onClick={() => {/* Will be implemented later */ }}
                        >
                            Начать обучение
                        </button>
                    </div>

                    {/* Course Content */}
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title" style={{ color: "#5A3E36" }}>Содержание курса</h2>

                                {courseData?.modules?.length > 0 ? (
                                    courseData.modules.map((module, index) => (
                                        <div key={module.id} className="mb-4">
                                            <h3 style={{ color: "#5A3E36", fontSize: "1.3rem" }}>
                                                Модуль {index + 1}: {module.name}
                                            </h3>
                                            <p className="text-muted">{module.description}</p>

                                            {/* Topics */}
                                            {module.topics?.length > 0 && (
                                                <div className="ms-4">
                                                    {module.topics.map((topic, topicIndex) => (
                                                        <div key={topic.id} className="mb-3">
                                                            <h4 style={{ color: "#5A3E36", fontSize: "1.1rem" }}>
                                                                {index + 1}.{topicIndex + 1} {topic.name}
                                                            </h4>
                                                            <p className="text-muted">{topic.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted">В данном курсе пока нет модулей.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CourseDetailsPage; 
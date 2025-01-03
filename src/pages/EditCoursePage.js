import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CourseService } from "../api";

const CourseSidebar = ({ courseData }) => {
    const location = useLocation();
    const { id } = useParams();

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: `/teach/edit-course/${id}`, label: "Редактировать" },
        // Other menu items will be added later
    ];

    return (
        <div
            style={{
                width: "250px",
                backgroundColor: "#D2C4B3",
                color: "#5A3E36",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                height: "auto",
            }}
        >
            {/* Course Image */}
            <div className="text-center mb-4">
                <img
                    src={courseData?.image || '/placeholder.png'}
                    alt="Course"
                    style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "5px",
                        marginBottom: "15px"
                    }}
                    onError={(e) => {
                        e.target.src = '/placeholder.png';
                    }}
                />
                <h3 style={{
                    fontSize: "16px",
                    color: "#5A3E36",
                    wordWrap: "break-word"
                }}>
                    {courseData?.name || "Loading..."}
                </h3>
            </div>

            {/* Navigation Links */}
            <nav style={{ flex: "1" }}>
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{
                            display: "block",
                            color: isActive(item.path) ? "#5A3E36" : "#fff",
                            textDecoration: "none",
                            marginBottom: "10px",
                            fontWeight: isActive(item.path) ? "bold" : "normal",
                            padding: "8px 0",
                        }}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

const EditCoursePage = () => {
    const { id } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await CourseService.getCourseById(id);
                setCourseData(data);
            } catch (error) {
                setError("Ошибка при загрузке данных курса");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (isLoading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F7F3EF" }}>
                <Header />
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#F7F3EF" }}>
            <Header />
            <div style={{ display: "flex", flex: "1", overflow: "hidden" }}>
                <CourseSidebar courseData={courseData} />
                <div style={{ flex: "1", padding: "20px", overflowY: "auto" }}>
                    <h1 style={{ color: "#5A3E36" }}>Редактирование курса</h1>
                    {error && (
                        <div className="alert alert-danger mt-3">
                            {error}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EditCoursePage; 
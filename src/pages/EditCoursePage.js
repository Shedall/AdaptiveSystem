import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CourseService } from "../api";
import Modal from '../components/Modal';

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

const ModuleForm = ({ module, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: module?.name || '',
        description: module?.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Название модуля:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Описание модуля:</label>
                <textarea
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                />
            </div>
            <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">Сохранить</button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Отмена</button>
            </div>
        </form>
    );
};

const TopicForm = ({ topic, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: topic?.name || '',
        description: topic?.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Название темы:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Описание темы:</label>
                <textarea
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                />
            </div>
            <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">Сохранить</button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Отмена</button>
            </div>
        </form>
    );
};

const EditCoursePage = () => {
    const { id } = useParams();
    const [courseData, setCourseData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingModule, setEditingModule] = useState(null);
    const [editingTopic, setEditingTopic] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [showModuleModal, setShowModuleModal] = useState(false);
    const [showTopicModal, setShowTopicModal] = useState(false);

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

    const handleSaveModule = async (moduleData) => {
        try {
            if (editingModule.id) {
                await CourseService.updateModule(editingModule.id, {
                    ...moduleData,
                    course: courseData.id,
                });
            } else {
                await CourseService.createModule({
                    ...moduleData,
                    course: courseData.id,
                    topics: [],
                });
            }
            const updatedCourse = await CourseService.getCourseById(id);
            setCourseData(updatedCourse);
            setEditingModule(null);
            setShowModuleModal(false);
        } catch (error) {
            setError("Ошибка при сохранении модуля");
        }
    };

    const handleSaveTopic = async (topicData) => {
        try {
            if (editingTopic.id) {
                await CourseService.updateTopic(editingTopic.id, {
                    ...topicData,
                    module: selectedModule.id,
                });
            } else {
                await CourseService.createTopic({
                    ...topicData,
                    module: selectedModule.id,
                });
            }
            const updatedCourse = await CourseService.getCourseById(id);
            setCourseData(updatedCourse);
            setEditingTopic(null);
            setShowTopicModal(false);
        } catch (error) {
            setError("Ошибка при сохранении темы");
        }
    };

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

                    <div className="mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 style={{ color: "#5A3E36", margin: 0 }}>Модули</h2>
                            <button
                                className="btn"
                                onClick={() => {
                                    setEditingModule({});
                                    setShowModuleModal(true);
                                }}
                                style={{ backgroundColor: "#5A3E36", color: "#fff" }}
                            >
                                Добавить модуль
                            </button>
                        </div>

                        {courseData.modules.map(module => (
                            <div key={module.id} className="card mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <h3>{module.name}</h3>
                                            <p>{module.description}</p>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm"
                                                onClick={() => {
                                                    setEditingModule(module);
                                                    setShowModuleModal(true);
                                                }}
                                                style={{
                                                    backgroundColor: "#D2C4B3",
                                                    color: "#5A3E36"
                                                }}
                                            >
                                                Редактировать
                                            </button>
                                            <button
                                                className="btn btn-sm"
                                                onClick={async () => {
                                                    if (window.confirm('Вы уверены, что хотите удалить этот модуль?')) {
                                                        try {
                                                            await CourseService.deleteModule(module.id);
                                                            const updatedCourse = await CourseService.getCourseById(id);
                                                            setCourseData(updatedCourse);
                                                        } catch (error) {
                                                            setError("Ошибка при удалении модуля " + error);
                                                        }
                                                    }
                                                }}
                                                style={{
                                                    backgroundColor: "#dc3545",
                                                    color: "#fff"
                                                }}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h4>Темы</h4>
                                            <button
                                                className="btn btn-sm"
                                                onClick={() => {
                                                    setSelectedModule(module);
                                                    setEditingTopic({});
                                                    setShowTopicModal(true);
                                                }}
                                                style={{
                                                    backgroundColor: "#5A3E36",
                                                    color: "#fff"
                                                }}
                                            >
                                                Добавить тему
                                            </button>
                                        </div>

                                        {module.topics.map(topic => (
                                            <div key={topic.id} className="card mb-2 mt-2">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <h5>{topic.name}</h5>
                                                            <p className="mb-0">{topic.description}</p>
                                                        </div>
                                                        <div className="d-flex gap-2">
                                                            <button
                                                                className="btn btn-sm"
                                                                onClick={() => {
                                                                    setSelectedModule(module);
                                                                    setEditingTopic(topic);
                                                                    setShowTopicModal(true);
                                                                }}
                                                                style={{
                                                                    backgroundColor: "#D2C4B3",
                                                                    color: "#5A3E36"
                                                                }}
                                                            >
                                                                Редактировать
                                                            </button>
                                                            <button
                                                                className="btn btn-sm"
                                                                onClick={async () => {
                                                                    if (window.confirm('Вы уверены, что хотите удалить эту тему?')) {
                                                                        try {
                                                                            await CourseService.deleteTopic(topic.id);
                                                                            const updatedCourse = await CourseService.getCourseById(id);
                                                                            setCourseData(updatedCourse);
                                                                        } catch (error) {
                                                                            setError("Ошибка при удалении темы " + error);
                                                                        }
                                                                    }
                                                                }}
                                                                style={{
                                                                    backgroundColor: "#dc3545",
                                                                    color: "#fff"
                                                                }}
                                                            >
                                                                Удалить
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Modals */}
                    <Modal
                        isOpen={showModuleModal}
                        onClose={() => {
                            setShowModuleModal(false);
                            setEditingModule(null);
                        }}
                        title={editingModule?.id ? "Редактировать модуль" : "Создать модуль"}
                    >
                        <ModuleForm
                            module={editingModule}
                            onSave={handleSaveModule}
                            onCancel={() => {
                                setShowModuleModal(false);
                                setEditingModule(null);
                            }}
                        />
                    </Modal>

                    <Modal
                        isOpen={showTopicModal}
                        onClose={() => {
                            setShowTopicModal(false);
                            setEditingTopic(null);
                        }}
                        title={editingTopic?.id ? "Редактировать тему" : "Создать тему"}
                    >
                        <TopicForm
                            topic={editingTopic}
                            onSave={handleSaveTopic}
                            onCancel={() => {
                                setShowTopicModal(false);
                                setEditingTopic(null);
                            }}
                        />
                    </Modal>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EditCoursePage; 
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CourseService } from "../api";
import Modal from '../components/Modal';
import CourseSidebar from '../components/course-edit/CourseSidebar';
import ModuleForm from '../components/course-edit/ModuleForm';
import TopicForm from '../components/course-edit/TopicForm';
import ModuleList from '../components/course-edit/ModuleList';
import CourseForm from '../components/course-edit/CourseForm';

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
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

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

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth < 768;

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

    const handleDeleteModule = async (moduleId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот модуль?')) {
            try {
                await CourseService.deleteModule(moduleId);
                const updatedCourse = await CourseService.getCourseById(id);
                setCourseData(updatedCourse);
            } catch (error) {
                setError("Ошибка при удалении модуля");
            }
        }
    };

    const handleDeleteTopic = async (topicId) => {
        if (window.confirm('Вы уверены, что хотите удалить эту тему?')) {
            try {
                await CourseService.deleteTopic(topicId);
                const updatedCourse = await CourseService.getCourseById(id);
                setCourseData(updatedCourse);
            } catch (error) {
                setError("Ошибка при удалении темы");
            }
        }
    };

    const handleEditModule = (module) => {
        setEditingModule(module);
        setShowModuleModal(true);
    };

    const handleAddModule = () => {
        setEditingModule({});
        setShowModuleModal(true);
    };

    const handleAddTopic = (module) => {
        setSelectedModule(module);
        setEditingTopic({});
        setShowTopicModal(true);
    };

    const handleEditTopic = (module, topic) => {
        setSelectedModule(module);
        setEditingTopic(topic);
        setShowTopicModal(true);
    };

    const handleEditCourse = async (formData) => {
        try {
            await CourseService.updateCourse(id, formData);
            const updatedCourse = await CourseService.getCourseById(id);
            setCourseData(updatedCourse);
            setShowEditModal(false);
        } catch (error) {
            setError(error.detail || "Ошибка при обновлении курса");
        }
    };

    const handleDeleteCourse = async () => {
        try {
            await CourseService.deleteCourse(id);
            navigate('/teach');
        } catch (error) {
            setError(error.detail || "Ошибка при удалении курса");
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
            <div style={{
                display: "flex",
                flex: 1
            }}>
                {!isMobile && (
                    <CourseSidebar
                        courseData={courseData}
                        isMobile={isMobile}
                        onEdit={() => setShowEditModal(true)}
                        onDelete={() => setShowDeleteModal(true)}
                    />
                )}
                <div style={{
                    flex: "1",
                    padding: "20px",
                    maxWidth: isMobile ? "100%" : "calc(100% - 250px)",
                    margin: "0 auto",
                    width: "100%"
                }}>
                    <h1 style={{ color: "#5A3E36" }}>Редактирование курса</h1>
                    {error && (
                        <div className="alert alert-danger mt-3">{error}</div>
                    )}

                    <ModuleList
                        modules={courseData.modules}
                        courseId={courseData.id}
                        courseTests={courseData.tests}
                        onEditModule={handleEditModule}
                        onDeleteModule={handleDeleteModule}
                        onAddTopic={handleAddTopic}
                        onEditTopic={handleEditTopic}
                        onDeleteTopic={handleDeleteTopic}
                        onAddModule={handleAddModule}
                        onCourseUpdate={(updatedCourse) => setCourseData(updatedCourse)}
                    />

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

                    <Modal
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        title="Редактировать курс"
                    >
                        <CourseForm
                            initialData={courseData}
                            onSave={handleEditCourse}
                            onCancel={() => setShowEditModal(false)}
                        />
                    </Modal>

                    <Modal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        title="Удалить курс"
                    >
                        <div className="p-3">
                            <p>Вы уверены, что хотите удалить этот курс?</p>
                            <p>Это действие нельзя будет отменить.</p>
                            <div className="d-flex gap-2 mt-4">
                                <button
                                    className="btn"
                                    onClick={handleDeleteCourse}
                                    style={{ backgroundColor: "#dc3545", color: "#fff" }}
                                >
                                    Удалить
                                </button>
                                <button
                                    className="btn"
                                    onClick={() => setShowDeleteModal(false)}
                                    style={{ backgroundColor: "#D2C4B3", color: "#5A3E36" }}
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EditCoursePage; 
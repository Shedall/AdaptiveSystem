import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CourseService } from "../api";
import Modal from '../components/Modal';
import CourseSidebar from '../components/course-edit/CourseSidebar';
import ModuleForm from '../components/course-edit/ModuleForm';
import TopicForm from '../components/course-edit/TopicForm';
import ModuleList from '../components/course-edit/ModuleList';

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
            {isMobile && <CourseSidebar courseData={courseData} isMobile={true} />}
            <div style={{
                display: "flex",
                flex: "1",
                overflow: "hidden",
                maxWidth: "1400px",
                margin: "0 auto",
                width: "100%",
                paddingLeft: isMobile ? "20px" : windowWidth > 1400 ? "120px" : "40px",
                paddingRight: isMobile ? "20px" : windowWidth > 1400 ? "120px" : "40px",
                gap: "40px"
            }}>
                {!isMobile && <CourseSidebar courseData={courseData} isMobile={false} />}
                <div style={{
                    flex: "1",
                    padding: "20px",
                    overflowY: "auto",
                    maxWidth: "1200px",
                    margin: "0 auto",
                    width: "100%"
                }}>
                    <h1 style={{ color: "#5A3E36" }}>Редактирование курса</h1>
                    {error && (
                        <div className="alert alert-danger mt-3">{error}</div>
                    )}

                    <ModuleList
                        modules={courseData.modules}
                        onAddModule={() => {
                            setEditingModule({});
                            setShowModuleModal(true);
                        }}
                        onEditModule={(module) => {
                            setEditingModule(module);
                            setShowModuleModal(true);
                        }}
                        onDeleteModule={handleDeleteModule}
                        onAddTopic={(module) => {
                            setSelectedModule(module);
                            setEditingTopic({});
                            setShowTopicModal(true);
                        }}
                        onEditTopic={(module, topic) => {
                            setSelectedModule(module);
                            setEditingTopic(topic);
                            setShowTopicModal(true);
                        }}
                        onDeleteTopic={handleDeleteTopic}
                        selectedModule={selectedModule}
                        editingTopic={editingTopic}
                        showTopicModal={showTopicModal}
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
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EditCoursePage; 
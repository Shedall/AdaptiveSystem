import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CourseService } from "../api";
import Modal from '../components/Modal';
import ContentForm from '../components/course-edit/ContentForm';
import TopicForm from '../components/course-edit/TopicForm';

const EditTopicPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [topicData, setTopicData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [showContentModal, setShowContentModal] = useState(false);
    const [showTopicModal, setShowTopicModal] = useState(false);
    const [editingContent, setEditingContent] = useState(null);

    useEffect(() => {
        const fetchTopic = async () => {
            try {
                const data = await CourseService.getTopicById(id);
                setTopicData(data);
            } catch (error) {
                setError("Ошибка при загрузке данных темы");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTopic();
    }, [id]);

    const handleSaveContent = async (formData) => {
        try {
            if (editingContent) {
                await CourseService.updateContent(editingContent.id, formData);
            } else {
                formData.append('topic', id);
                await CourseService.createContent(formData);
            }
            const updatedTopic = await CourseService.getTopicById(id);
            setTopicData(updatedTopic);
            setShowContentModal(false);
            setEditingContent(null);
        } catch (error) {
            setError("Ошибка при сохранении материала");
        }
    };

    const handleDeleteContent = async (contentId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот материал?')) {
            try {
                await CourseService.deleteContent(contentId);
                const updatedTopic = await CourseService.getTopicById(id);
                setTopicData(updatedTopic);
            } catch (error) {
                setError("Ошибка при удалении материала");
            }
        }
    };

    const handleSaveTopic = async (topicData) => {
        try {
            await CourseService.updateTopic(id, {
                ...topicData,
                module: topicData.module
            });
            const updatedTopic = await CourseService.getTopicById(id);
            setTopicData(updatedTopic);
            setShowTopicModal(false);
        } catch (error) {
            setError("Ошибка при сохранении темы");
        }
    };

    const handleDeleteTopic = async () => {
        if (window.confirm('Вы уверены, что хотите удалить эту тему?')) {
            try {
                await CourseService.deleteTopic(id);
                navigate(`/teach/edit-course/${topicData.module}`);
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
            <div style={{
                flex: "1",
                padding: "20px",
                maxWidth: "1200px",
                margin: "0 auto",
                width: "100%"
            }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 style={{ color: "#5A3E36" }}>{topicData?.name}</h1>
                    <div className="d-flex gap-2">
                        <button
                            className="btn"
                            onClick={() => setShowTopicModal(true)}
                            style={{ backgroundColor: "#D2C4B3", color: "#5A3E36" }}
                        >
                            Редактировать тему
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={handleDeleteTopic}
                        >
                            Удалить тему
                        </button>
                    </div>
                </div>

                <p className="mb-4">{topicData?.description}</p>

                {error && (
                    <div className="alert alert-danger mb-4">
                        {error}
                    </div>
                )}

                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="card-title mb-0">Материалы темы</h5>
                            <button
                                className="btn"
                                onClick={() => {
                                    setEditingContent(null);
                                    setShowContentModal(true);
                                }}
                                style={{ backgroundColor: "#5A3E36", color: "#fff" }}
                            >
                                Добавить материал
                            </button>
                        </div>
                        {topicData?.contents && topicData.contents.length > 0 ? (
                            <div className="list-group">
                                {topicData.contents.map(content => (
                                    <div key={content.id}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        <a
                                            href={content.file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color: "#5A3E36",
                                                textDecoration: "none"
                                            }}
                                        >
                                            {content.label}
                                        </a>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm"
                                                onClick={() => {
                                                    setEditingContent(content);
                                                    setShowContentModal(true);
                                                }}
                                                style={{
                                                    backgroundColor: "#D2C4B3",
                                                    color: "#5A3E36"
                                                }}
                                            >
                                                Редактировать
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteContent(content.id)}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted">Нет материалов</p>
                        )}
                    </div>
                </div>

                <Modal
                    isOpen={showContentModal}
                    onClose={() => {
                        setShowContentModal(false);
                        setEditingContent(null);
                    }}
                    title={editingContent ? "Редактировать материал" : "Добавить материал"}
                >
                    <ContentForm
                        content={editingContent}
                        onSave={handleSaveContent}
                        onCancel={() => {
                            setShowContentModal(false);
                            setEditingContent(null);
                        }}
                    />
                </Modal>

                <Modal
                    isOpen={showTopicModal}
                    onClose={() => setShowTopicModal(false)}
                    title="Редактировать тему"
                >
                    <TopicForm
                        topic={topicData}
                        onSave={handleSaveTopic}
                        onCancel={() => setShowTopicModal(false)}
                    />
                </Modal>
            </div>
            <Footer />
        </div>
    );
};

export default EditTopicPage; 
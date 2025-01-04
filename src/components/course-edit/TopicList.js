import React, { useState } from 'react';
import Modal from '../Modal';
import ContentForm from './ContentForm';
import { CourseService } from '../../api';
import { Link } from 'react-router-dom';

const TopicList = ({
    module,
    topics,
    onAddTopic,
    onEditTopic,
    onDeleteTopic,
    onTopicUpdate
}) => {
    const [showContentModal, setShowContentModal] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);

    const handleAddContent = async (formData) => {
        try {
            formData.append('topic', selectedTopic.id);
            await CourseService.createContent(formData);
            setShowContentModal(false);
            onTopicUpdate();
        } catch (error) {
            console.error('Error adding content:', error);
        }
    };

    const handleDeleteContent = async (contentId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот материал?')) {
            try {
                await CourseService.deleteContent(contentId);
                onTopicUpdate();
            } catch (error) {
                console.error('Error deleting content:', error);
            }
        }
    };

    return (
        <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center">
                <h4>Темы</h4>
                <button
                    className="btn btn-sm"
                    onClick={() => onAddTopic(module)}
                    style={{
                        backgroundColor: "#5A3E36",
                        color: "#fff"
                    }}
                >
                    Добавить тему
                </button>
            </div>

            {topics.map(topic => (
                <div key={topic.id} className="card mb-2 mt-2">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <Link
                                    to={`/teach/edit-topic/${topic.id}`}
                                    style={{
                                        color: "#5A3E36",
                                        textDecoration: "none"
                                    }}
                                >
                                    <h5>{topic.name}</h5>
                                    <p className="mb-0">{topic.description}</p>
                                </Link>
                            </div>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn btn-sm"
                                    onClick={() => onEditTopic(module, topic)}
                                    style={{
                                        backgroundColor: "#D2C4B3",
                                        color: "#5A3E36"
                                    }}
                                >
                                    Редактировать
                                </button>
                                <button
                                    className="btn btn-sm"
                                    onClick={() => onDeleteTopic(topic.id)}
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
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="mb-0">Материалы</h6>
                                <button
                                    className="btn btn-sm"
                                    onClick={() => {
                                        setSelectedTopic(topic);
                                        setShowContentModal(true);
                                    }}
                                    style={{
                                        backgroundColor: "#5A3E36",
                                        color: "#fff"
                                    }}
                                >
                                    Добавить материал
                                </button>
                            </div>

                            {topic.contents && topic.contents.length > 0 ? (
                                <div className="list-group">
                                    {topic.contents.map(content => (
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
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteContent(content.id)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted small">Нет материалов</p>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            <Modal
                isOpen={showContentModal}
                onClose={() => setShowContentModal(false)}
                title="Добавить материал"
            >
                <ContentForm
                    onSave={handleAddContent}
                    onCancel={() => setShowContentModal(false)}
                />
            </Modal>
        </div>
    );
};

export default TopicList; 
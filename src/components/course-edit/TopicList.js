import React from 'react';
import { Link } from 'react-router-dom';

const TopicList = ({
    module,
    topics,
    onAddTopic,
    onEditTopic,
    onDeleteTopic,
}) => {
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

            {topics && topics.length > 0 ? (
                topics.map(topic => (
                    <div key={topic.id} className="card mb-2 mt-2">
                        <Link
                            to={`/teach/edit-topic/${topic.id}`}
                            style={{
                                color: "#5A3E36",
                                textDecoration: "none"
                            }}
                            className="card-body position-relative"
                        >
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h5>{topic.name}</h5>
                                    <p className="mb-0">{topic.description}</p>
                                </div>
                                <div className="d-flex gap-2" style={{ zIndex: 1 }} onClick={e => e.preventDefault()}>
                                    <button
                                        className="btn btn-sm"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onEditTopic(module, topic);
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
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onDeleteTopic(topic.id);
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
                        </Link>
                    </div>
                ))
            ) : (
                <div className="text-center p-3" style={{ color: "#5A3E36" }}>
                    <p className="mb-0">В модуле пока нет тем. Создайте первую тему, нажав кнопку "Добавить тему".</p>
                </div>
            )}
        </div>
    );
};

export default TopicList; 
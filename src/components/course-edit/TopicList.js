import React from 'react';

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

            {topics.map(topic => (
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
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TopicList; 
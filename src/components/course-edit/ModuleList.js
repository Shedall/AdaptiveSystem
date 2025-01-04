import React from 'react';
import TopicList from './TopicList';

const ModuleList = ({
    modules,
    onEditModule,
    onDeleteModule,
    onAddTopic,
    onEditTopic,
    onDeleteTopic,
    onAddModule
}) => {
    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 style={{ color: "#5A3E36", margin: 0 }}>Модули</h2>
                <button
                    className="btn"
                    onClick={onAddModule}
                    style={{ backgroundColor: "#5A3E36", color: "#fff" }}
                >
                    Добавить модуль
                </button>
            </div>

            {modules && modules.length > 0 ? (
                modules.map(module => (
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
                                        onClick={() => onEditModule(module)}
                                        style={{
                                            backgroundColor: "#D2C4B3",
                                            color: "#5A3E36"
                                        }}
                                    >
                                        Редактировать
                                    </button>
                                    <button
                                        className="btn btn-sm"
                                        onClick={() => onDeleteModule(module.id)}
                                        style={{
                                            backgroundColor: "#dc3545",
                                            color: "#fff"
                                        }}
                                    >
                                        Удалить
                                    </button>
                                </div>
                            </div>

                            <TopicList
                                module={module}
                                topics={module.topics || []}
                                onAddTopic={onAddTopic}
                                onEditTopic={onEditTopic}
                                onDeleteTopic={onDeleteTopic}
                            />
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center p-4" style={{ color: "#5A3E36" }}>
                    <p>В курсе пока нет модулей. Создайте первый модуль, нажав кнопку "Добавить модуль".</p>
                </div>
            )}
        </div>
    );
};

export default ModuleList; 
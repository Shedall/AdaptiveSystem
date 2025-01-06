import React, { useState, useEffect } from 'react';
import TopicList from './TopicList';
import IconButton from '../IconButton';
import Modal from '../Modal';
import { CourseService } from '../../api';
import { Link } from 'react-router-dom';

const TestForm = ({ onSave, onCancel, initialData }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Название теста:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Описание теста:</label>
                <textarea
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                />
            </div>
            <div className="d-flex gap-2">
                <button type="submit" className="btn" style={{ backgroundColor: "#5A3E36", color: "#fff" }}>
                    Сохранить
                </button>
                <button
                    type="button"
                    className="btn"
                    onClick={onCancel}
                    style={{ backgroundColor: "#D2C4B3", color: "#5A3E36" }}
                >
                    Отмена
                </button>
            </div>
        </form>
    );
};

const ModuleList = ({
    modules,
    courseId,
    courseTests: courseTestIds,
    onEditModule,
    onDeleteModule,
    onAddTopic,
    onEditTopic,
    onDeleteTopic,
    onAddModule,
    onCourseUpdate
}) => {
    const [showTestModal, setShowTestModal] = useState(false);
    const [currentTestData, setCurrentTestData] = useState(null);
    const [currentModuleId, setCurrentModuleId] = useState(null);
    const [isEntranceTest, setIsEntranceTest] = useState(false);
    const [error, setError] = useState("");
    const [courseTests, setCourseTests] = useState([]);
    const [moduleTests, setModuleTests] = useState({});

    useEffect(() => {
        const fetchTestDetails = async () => {
            if (courseTestIds?.length > 0) {
                try {
                    const tests = await Promise.all(
                        courseTestIds.map(id => CourseService.getTestById(id))
                    );
                    setCourseTests(tests);
                } catch (error) {
                    console.error('Error fetching course tests:', error);
                }
            }
        };
        fetchTestDetails();
    }, [courseTestIds]);

    useEffect(() => {
        const fetchModuleTestDetails = async () => {
            const newModuleTests = {};
            for (const module of modules || []) {
                if (module.tests?.length > 0) {
                    try {
                        const tests = await Promise.all(
                            module.tests.map(id => CourseService.getTestById(id))
                        );
                        newModuleTests[module.id] = tests;
                    } catch (error) {
                        console.error(`Error fetching tests for module ${module.id}:`, error);
                    }
                }
            }
            setModuleTests(newModuleTests);
        };
        fetchModuleTestDetails();
    }, [modules]);

    const handleCreateTest = async (formData) => {
        try {
            setError("");
            if (isEntranceTest) {
                await CourseService.createEntranceTest({
                    ...formData,
                    object_id: courseId
                });
            } else {
                await CourseService.createModuleTest({
                    ...formData,
                    object_id: currentModuleId
                });
            }
            const updatedCourse = await CourseService.getCourseById(courseId);
            onCourseUpdate(updatedCourse);
            setShowTestModal(false);
        } catch (error) {
            setError(error.detail || "Ошибка при создании теста");
            console.error('Error creating test:', error);
        }
    };

    const handleUpdateTest = async (testId, formData) => {
        try {
            await CourseService.updateTest(testId, formData);
            const updatedCourse = await CourseService.getCourseById(courseId);
            onCourseUpdate(updatedCourse);
            setShowTestModal(false);
        } catch (error) {
            console.error('Error updating test:', error);
        }
    };

    const handleDeleteTest = async (testId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот тест?')) {
            try {
                await CourseService.deleteTest(testId);
                const updatedCourse = await CourseService.getCourseById(courseId);
                onCourseUpdate(updatedCourse);
            } catch (error) {
                console.error('Error deleting test:', error);
            }
        }
    };

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 style={{ color: "#5A3E36", margin: 0 }}>Модули</h2>
                <div className="d-flex gap-2">
                    {courseTests.length === 0 && (
                        <IconButton
                            icon="add_icon.svg"
                            text="Добавить тест курса"
                            onClick={() => {
                                setError("");
                                setIsEntranceTest(true);
                                setCurrentTestData(null);
                                setShowTestModal(true);
                            }}
                        />
                    )}
                    <IconButton
                        icon="add_icon.svg"
                        text="Добавить модуль"
                        onClick={onAddModule}
                    />
                </div>
            </div>

            {courseTests.length > 0 && (
                <div className="card mb-3">
                    <div className="card-body">
                        <h4>Тесты курса:</h4>
                        <div className="list-group">
                            {courseTests.map(test => (
                                <Link
                                    to={`/teach/edit-test/${test.id}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <div className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 className="mb-1">{test.name}</h5>
                                            <p className="mb-0 text-muted">{test.description}</p>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <IconButton
                                                icon="edit_icon.svg"
                                                onClick={() => {
                                                    setError("");
                                                    setIsEntranceTest(true);
                                                    setCurrentTestData(test);
                                                    setShowTestModal(true);
                                                }}
                                                variant="secondary"
                                                size="sm"
                                            />
                                            <IconButton
                                                icon="delete_icon.svg"
                                                onClick={() => handleDeleteTest(test.id)}
                                                variant="danger"
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

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
                                    {!moduleTests[module.id]?.length && (
                                        <IconButton
                                            icon="add_icon.svg"
                                            text="Добавить тест"
                                            onClick={() => {
                                                setIsEntranceTest(false);
                                                setCurrentModuleId(module.id);
                                                setCurrentTestData(null);
                                                setShowTestModal(true);
                                            }}
                                        />
                                    )}
                                    <IconButton
                                        icon="edit_icon.svg"
                                        onClick={() => onEditModule(module)}
                                        variant="secondary"
                                        size="sm"
                                    />
                                    <IconButton
                                        icon="delete_icon.svg"
                                        onClick={() => onDeleteModule(module.id)}
                                        variant="danger"
                                        size="sm"
                                    />
                                </div>
                            </div>

                            {moduleTests[module.id]?.length > 0 && (
                                <div className="mb-3">
                                    <h4>Тесты модуля:</h4>
                                    <div className="list-group">
                                        {moduleTests[module.id].map(test => (
                                            <Link
                                                to={`/teach/edit-test/${test.id}`}
                                                style={{ textDecoration: 'none', color: 'inherit' }}
                                            >
                                                <div className="list-group-item d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h5 className="mb-1">{test.name}</h5>
                                                        <p className="mb-0 text-muted">{test.description}</p>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <IconButton
                                                            icon="edit_icon.svg"
                                                            onClick={() => {
                                                                setError("");
                                                                setIsEntranceTest(false);
                                                                setCurrentModuleId(module.id);
                                                                setCurrentTestData(test);
                                                                setShowTestModal(true);
                                                            }}
                                                            variant="secondary"
                                                            size="sm"
                                                        />
                                                        <IconButton
                                                            icon="delete_icon.svg"
                                                            onClick={() => handleDeleteTest(test.id)}
                                                            variant="danger"
                                                            size="sm"
                                                        />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

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

            <Modal
                isOpen={showTestModal}
                onClose={() => {
                    setShowTestModal(false);
                    setError("");
                }}
                title={currentTestData ? "Редактировать тест" : "Создать тест"}
            >
                {error && (
                    <div className="alert alert-danger mb-3">
                        {error}
                    </div>
                )}
                <TestForm
                    initialData={currentTestData}
                    onSave={(formData) => {
                        if (currentTestData) {
                            handleUpdateTest(currentTestData.id, formData);
                        } else {
                            handleCreateTest(formData);
                        }
                    }}
                    onCancel={() => {
                        setShowTestModal(false);
                        setError("");
                    }}
                />
            </Modal>
        </div>
    );
};

export default ModuleList; 
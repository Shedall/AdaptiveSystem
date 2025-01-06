import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CourseService } from "../api";
import Modal from '../components/Modal';
import IconButton from '../components/IconButton';

const QuestionForm = ({ onSave, onCancel, initialData = null }) => {
    const [formData, setFormData] = useState({
        text: initialData?.text || '',
        answers: initialData?.answers || [{ text: '', is_right: false }]
    });
    const [formError, setFormError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError("");

        // Filter out empty answers
        const validAnswers = formData.answers.filter(a => a.text.trim() !== '');

        // Validation
        if (validAnswers.length < 2) {
            setFormError('Необходимо добавить минимум 2 ответа');
            return;
        }

        if (!validAnswers.some(answer => answer.is_right)) {
            setFormError('Необходимо отметить хотя бы один правильный ответ');
            return;
        }

        onSave({
            text: formData.text,
            answers: validAnswers
        });
    };

    const handleAddAnswer = () => {
        setFormData({
            ...formData,
            answers: [...formData.answers, { text: '', is_right: false }]
        });
    };

    const handleAnswerChange = (index, field, value) => {
        const newAnswers = [...formData.answers];
        newAnswers[index] = { ...newAnswers[index], [field]: value };
        setFormData({
            ...formData,
            answers: newAnswers
        });
    };

    const handleRemoveAnswer = (index) => {
        const newAnswers = formData.answers.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            answers: newAnswers
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            {formError && (
                <div className="alert alert-danger mb-3">
                    {formError}
                </div>
            )}

            <div className="mb-4">
                <label className="form-label">Текст вопроса:</label>
                <textarea
                    className="form-control"
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="form-label mb-3">Ответы:</label>
                {formData.answers.map((answer, index) => (
                    <div key={index} className="d-flex gap-2 mb-2 align-items-center">
                        <div className="form-check" style={{ marginRight: '8px' }}>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={answer.is_right}
                                onChange={(e) => handleAnswerChange(index, 'is_right', e.target.checked)}
                            />
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            value={answer.text}
                            onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
                            placeholder="Введите ответ"
                        />
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => handleRemoveAnswer(index)}
                            style={{
                                width: '38px',
                                height: '38px',
                                padding: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#dc3545',
                                border: 'none'
                            }}
                        >
                            <img
                                src="/icons/delete_icon.svg"
                                alt="Delete"
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    filter: 'brightness(0) invert(1)'
                                }}
                            />
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    className="btn w-100 mt-3"
                    onClick={handleAddAnswer}
                    style={{ backgroundColor: "#D2C4B3", color: "#5A3E36" }}
                >
                    Добавить ответ
                </button>
            </div>

            <div className="d-flex gap-2 mt-4">
                <button
                    type="submit"
                    className="btn"
                    style={{ backgroundColor: "#5A3E36", color: "#fff" }}
                >
                    {initialData ? "Обновить" : "Сохранить"}
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

const EditTestPage = () => {
    const { id } = useParams();
    const [testData, setTestData] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        answers: [{ text: '', is_right: false }]
    });
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchTestData = async () => {
            try {
                const test = await CourseService.getTestById(id);
                setTestData(test);
                setQuestions(test.questions || []);
            } catch (error) {
                setError(error.detail || "Ошибка при загрузке теста");
                console.error('Error fetching test data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTestData();
    }, [id]);

    const handleAddAnswer = () => {
        if (newQuestion.answers[newQuestion.answers.length - 1].text.trim() !== '') {
            setNewQuestion({
                ...newQuestion,
                answers: [...newQuestion.answers, { text: '', is_right: false }]
            });
        }
    };

    const handleAnswerChange = (index, field, value) => {
        const updatedAnswers = [...newQuestion.answers];
        updatedAnswers[index] = { ...updatedAnswers[index], [field]: value };
        setNewQuestion({
            ...newQuestion,
            answers: updatedAnswers
        });

        // Add new field if this is the last one and it's not empty
        if (index === updatedAnswers.length - 1 && value.trim() !== '') {
            handleAddAnswer();
        }
    };

    const handleCreateQuestion = async (formData) => {
        try {
            // First create the question
            const questionResponse = await CourseService.createQuestion({
                text: formData.text,
                test: Number(id)
            });

            // Then create all answers
            await Promise.all(formData.answers.map(answer =>
                CourseService.createAnswer({
                    ...answer,
                    question: questionResponse.id
                })
            ));

            // Refresh the test data
            const updatedTest = await CourseService.getTestById(id);
            setQuestions(updatedTest.questions || []);
            setShowQuestionModal(false);
            setEditingQuestion(null);
        } catch (error) {
            setError(error.detail || "Ошибка при создании вопроса");
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот вопрос?')) {
            try {
                await CourseService.deleteQuestion(questionId);
                const updatedTest = await CourseService.getTestById(id);
                setQuestions(updatedTest.questions || []);
            } catch (error) {
                setError(error.detail || "Ошибка при удалении вопроса");
            }
        }
    };

    const handleEditQuestion = (question) => {
        setEditingQuestionId(question.id);
        setNewQuestion({
            text: question.text,
            answers: [...question.answers]
        });
    };

    const handleUpdateQuestion = async (formData) => {
        try {
            await CourseService.updateQuestion(editingQuestion.id, {
                text: formData.text,
                test: Number(id)
            });

            // Handle answers
            const existingAnswerIds = editingQuestion.answers.map(a => a.id);
            const updatedAnswers = formData.answers;

            // Delete answers that are no longer present
            await Promise.all(
                existingAnswerIds
                    .filter(id => !updatedAnswers.find(a => a.id === id))
                    .map(id => CourseService.deleteAnswer(id))
            );

            // Update or create answers
            await Promise.all(updatedAnswers.map(answer => {
                if (answer.id) {
                    return CourseService.updateAnswer(answer.id, {
                        text: answer.text,
                        is_right: answer.is_right
                    });
                } else {
                    return CourseService.createAnswer({
                        ...answer,
                        question: editingQuestion.id
                    });
                }
            }));

            const updatedTest = await CourseService.getTestById(id);
            setQuestions(updatedTest.questions || []);
            setShowQuestionModal(false);
            setEditingQuestion(null);
        } catch (error) {
            setError(error.detail || "Ошибка при обновлении вопроса");
        }
    };

    const handleDeleteAnswer = async (answerId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот ответ?')) {
            try {
                await CourseService.deleteAnswer(answerId);
                const updatedTest = await CourseService.getTestById(id);
                setQuestions(updatedTest.questions || []);
            } catch (error) {
                setError(error.detail || "Ошибка при удалении ответа");
            }
        }
    };

    const filteredQuestions = questions.filter(question =>
        question.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleClearAll = async () => {
        if (window.confirm('Вы уверены, что хотите удалить все вопросы?')) {
            try {
                await Promise.all(questions.map(question =>
                    CourseService.deleteQuestion(question.id)
                ));
                const updatedTest = await CourseService.getTestById(id);
                setQuestions(updatedTest.questions || []);
            } catch (error) {
                setError(error.detail || "Ошибка при удалении вопросов");
            }
        }
    };

    if (isLoading) {
        return (
            <div style={{ backgroundColor: "#F7F3EF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
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
        <div style={{ backgroundColor: "#F7F3EF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />
            <div style={{
                flex: "1",
                padding: "20px",
                maxWidth: "1200px",
                margin: "0 auto",
                width: "100%"
            }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 style={{ color: "#5A3E36" }}>{testData?.name}</h1>
                    <IconButton
                        icon="add_icon.svg"
                        text="Добавить вопрос"
                        onClick={() => {
                            setEditingQuestion(null);
                            setShowQuestionModal(true);
                        }}
                    />
                </div>

                {error && <div className="alert alert-danger mb-4">{error}</div>}

                <div className="mb-4 position-relative">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Поиск вопросов..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            className="btn btn-link position-absolute"
                            style={{
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#5A3E36',
                                textDecoration: 'none'
                            }}
                            onClick={() => setSearchQuery('')}
                        >
                            Очистить
                        </button>
                    )}
                </div>

                {/* Questions list */}
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question) => (
                        <div key={question.id} className="card mb-4">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <h5 className="card-title">
                                        <span className="me-2" style={{ color: '#5A3E36' }}>
                                            {questions.findIndex(q => q.id === question.id) + 1}.
                                        </span>
                                        {question.text}
                                    </h5>
                                    <div className="d-flex gap-2">
                                        <IconButton
                                            icon="edit_icon.svg"
                                            onClick={() => {
                                                setEditingQuestion(question);
                                                setShowQuestionModal(true);
                                            }}
                                            variant="secondary"
                                            size="sm"
                                        />
                                        <IconButton
                                            icon="delete_icon.svg"
                                            onClick={() => handleDeleteQuestion(question.id)}
                                            variant="danger"
                                            size="sm"
                                        />
                                    </div>
                                </div>

                                <div className="list-group">
                                    {question.answers.map(answer => (
                                        <div key={answer.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center gap-2">
                                                <span className={answer.is_right ? "text-success" : "text-danger"}>
                                                    {answer.is_right ? "✓" : "✗"}
                                                </span>
                                                <span>{answer.text}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-4" style={{ color: "#5A3E36" }}>
                        {questions.length > 0 ?
                            "Нет вопросов, соответствующих поиску" :
                            "В тесте пока нет вопросов. Создайте первый вопрос, нажав кнопку «Добавить вопрос»"
                        }
                    </div>
                )}

                <Modal
                    isOpen={showQuestionModal}
                    onClose={() => {
                        setShowQuestionModal(false);
                        setEditingQuestion(null);
                    }}
                    title={editingQuestion ? "Редактировать вопрос" : "Создать вопрос"}
                >
                    <QuestionForm
                        initialData={editingQuestion}
                        onSave={(formData) => {
                            if (editingQuestion) {
                                handleUpdateQuestion(formData);
                            } else {
                                handleCreateQuestion(formData);
                            }
                        }}
                        onCancel={() => {
                            setShowQuestionModal(false);
                            setEditingQuestion(null);
                        }}
                    />
                </Modal>
            </div>
            <Footer />
        </div>
    );
};

export default EditTestPage; 
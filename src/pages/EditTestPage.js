import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CourseService } from "../api";
import Modal from '../components/Modal';
import IconButton from '../components/IconButton';

const QuestionForm = ({ onSave, onCancel, initialData }) => {
    const [text, setText] = useState(initialData?.text || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ text });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Текст вопроса:</label>
                <textarea
                    className="form-control"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
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

const AnswerForm = ({ onSave, onCancel, initialData }) => {
    const [formData, setFormData] = useState({
        text: initialData?.text || '',
        is_right: initialData?.is_right || false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Текст ответа:</label>
                <textarea
                    className="form-control"
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    required
                />
            </div>
            <div className="mb-3 form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="isRight"
                    checked={formData.is_right}
                    onChange={(e) => setFormData({ ...formData, is_right: e.target.checked })}
                />
                <label className="form-check-label" htmlFor="isRight">Правильный ответ</label>
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

const EditTestPage = () => {
    const { id } = useParams();
    const [testData, setTestData] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [showAnswerModal, setShowAnswerModal] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentAnswer, setCurrentAnswer] = useState(null);
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);

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

    const handleCreateQuestion = async (questionData) => {
        try {
            await CourseService.createQuestion({
                ...questionData,
                test: Number(id)
            });
            const updatedTest = await CourseService.getTestById(id);
            setQuestions(updatedTest.questions || []);
            setShowQuestionModal(false);
        } catch (error) {
            setError(error.detail || "Ошибка при создании вопроса");
        }
    };

    const handleUpdateQuestion = async (questionId, questionData) => {
        try {
            await CourseService.updateQuestion(questionId, questionData);
            const updatedTest = await CourseService.getTestById(id);
            setQuestions(updatedTest.questions || []);
            setShowQuestionModal(false);
        } catch (error) {
            setError(error.detail || "Ошибка при обновлении вопроса");
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

    const handleCreateAnswer = async (answerData) => {
        try {
            await CourseService.createAnswer({
                ...answerData,
                question: selectedQuestionId
            });
            const updatedTest = await CourseService.getTestById(id);
            setQuestions(updatedTest.questions || []);
            setShowAnswerModal(false);
        } catch (error) {
            setError(error.detail || "Ошибка при создании ответа");
        }
    };

    const handleUpdateAnswer = async (answerId, answerData) => {
        try {
            await CourseService.updateAnswer(answerId, answerData);
            const updatedTest = await CourseService.getTestById(id);
            setQuestions(updatedTest.questions || []);
            setShowAnswerModal(false);
        } catch (error) {
            setError(error.detail || "Ошибка при обновлении ответа");
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
                    <h1 style={{ color: "#5A3E36" }}>{testData.name}</h1>
                    <IconButton
                        icon="add_icon.svg"
                        text="Добавить вопрос"
                        onClick={() => {
                            setCurrentQuestion(null);
                            setShowQuestionModal(true);
                        }}
                    />
                </div>

                {error && <div className="alert alert-danger mb-4">{error}</div>}

                {questions.map(question => (
                    <div key={question.id} className="card mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <h5 className="card-title">{question.text}</h5>
                                <div className="d-flex gap-2">
                                    <IconButton
                                        icon="edit_icon.svg"
                                        onClick={() => {
                                            setCurrentQuestion(question);
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

                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6>Ответы:</h6>
                                <IconButton
                                    icon="add_icon.svg"
                                    text="Добавить ответ"
                                    onClick={() => {
                                        setSelectedQuestionId(question.id);
                                        setCurrentAnswer(null);
                                        setShowAnswerModal(true);
                                    }}
                                    size="sm"
                                />
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
                                        <div className="d-flex gap-2">
                                            <IconButton
                                                icon="edit_icon.svg"
                                                onClick={() => {
                                                    setSelectedQuestionId(question.id);
                                                    setCurrentAnswer(answer);
                                                    setShowAnswerModal(true);
                                                }}
                                                variant="secondary"
                                                size="sm"
                                            />
                                            <IconButton
                                                icon="delete_icon.svg"
                                                onClick={() => handleDeleteAnswer(answer.id)}
                                                variant="danger"
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                <Modal
                    isOpen={showQuestionModal}
                    onClose={() => setShowQuestionModal(false)}
                    title={currentQuestion ? "Редактировать вопрос" : "Создать вопрос"}
                >
                    <QuestionForm
                        initialData={currentQuestion}
                        onSave={(data) => {
                            if (currentQuestion) {
                                handleUpdateQuestion(currentQuestion.id, data);
                            } else {
                                handleCreateQuestion(data);
                            }
                        }}
                        onCancel={() => setShowQuestionModal(false)}
                    />
                </Modal>

                <Modal
                    isOpen={showAnswerModal}
                    onClose={() => setShowAnswerModal(false)}
                    title={currentAnswer ? "Редактировать ответ" : "Создать ответ"}
                >
                    <AnswerForm
                        initialData={currentAnswer}
                        onSave={(data) => {
                            if (currentAnswer) {
                                handleUpdateAnswer(currentAnswer.id, data);
                            } else {
                                handleCreateAnswer(data);
                            }
                        }}
                        onCancel={() => setShowAnswerModal(false)}
                    />
                </Modal>
            </div>
            <Footer />
        </div>
    );
};

export default EditTestPage; 
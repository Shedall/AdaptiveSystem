import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CourseService } from "../api";
import Modal from '../components/Modal';
import IconButton from '../components/IconButton';
import QuestionForm from '../components/test-edit/QuestionForm';
import QuestionList from '../components/test-edit/QuestionList';
import SearchBar from '../components/test-edit/SearchBar';

const EditTestPage = () => {
    const { id } = useParams();
    const [testData, setTestData] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [showQuestionModal, setShowQuestionModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchTestData();
    }, [id]);

    const fetchTestData = async () => {
        try {
            const test = await CourseService.getTestById(id);
            setTestData(test);
            setQuestions(test.questions || []);
        } catch (error) {
            setError(error.detail || "Ошибка при загрузке теста");
        } finally {
            setIsLoading(false);
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

    const filteredQuestions = questions.filter(question =>
        question.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

                <SearchBar
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClear={() => setSearchQuery('')}
                />

                <QuestionList
                    questions={questions}
                    filteredQuestions={filteredQuestions}
                    onEditQuestion={(question) => {
                        setEditingQuestion(question);
                        setShowQuestionModal(true);
                    }}
                    onDeleteQuestion={handleDeleteQuestion}
                />

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
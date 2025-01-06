import React from 'react';
import IconButton from '../IconButton';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

const QuestionList = ({
    questions,
    filteredQuestions,
    onEditQuestion,
    onDeleteQuestion
}) => {
    return (
        <>
            {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => (
                    <div key={question.id} className="card mb-4">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <h5 className="card-title">
                                    <span className="me-2" style={{ color: '#5A3E36' }}>
                                        {questions.findIndex(q => q.id === question.id) + 1}.
                                    </span>
                                    <Latex>{question.text}</Latex>
                                </h5>
                                <div className="d-flex gap-2">
                                    <IconButton
                                        icon="edit_icon.svg"
                                        onClick={() => onEditQuestion(question)}
                                        variant="secondary"
                                        size="sm"
                                    />
                                    <IconButton
                                        icon="delete_icon.svg"
                                        onClick={() => onDeleteQuestion(question.id)}
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
                                            <Latex>{answer.text}</Latex>
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
        </>
    );
};

export default QuestionList; 
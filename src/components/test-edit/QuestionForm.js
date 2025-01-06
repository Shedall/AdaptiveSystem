import React, { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import * as bootstrap from 'bootstrap';

const QuestionForm = ({ onSave, onCancel, initialData = null }) => {
    const [formData, setFormData] = useState({
        text: initialData?.text || '',
        answers: initialData?.answers || [{ text: '', is_right: false }]
    });
    const [formError, setFormError] = useState("");
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        // Initialize tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        // Cleanup tooltips on unmount
        return () => {
            tooltipTriggerList.forEach(tooltipTriggerEl => {
                const tooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
                if (tooltip) {
                    tooltip.dispose();
                }
            });
        };
    }, []);

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
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center gap-2">
                        <label className="form-label mb-0">Текст вопроса:</label>
                        <div className="position-relative" style={{ display: 'inline-block' }}>
                            <img
                                src="/icons/info_icon.svg"
                                alt="Info"
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'help'
                                }}
                                data-bs-toggle="tooltip"
                                data-bs-html="true"
                                title="Для использования формул запишите их в формате LaTeX между знаками доллара, например: $x^2 + y^2 = z^2$"
                            />
                            <div
                                className="position-absolute bg-white p-3 rounded shadow"
                                style={{
                                    display: 'none',
                                    width: '300px',
                                    zIndex: 1000,
                                    top: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    border: '1px solid #dee2e6'
                                }}
                            >
                                <p className="mb-2">Для использования формул запишите их в формате LaTeX между знаками доллара.</p>
                                <p className="mb-2">Пример:</p>
                                <pre className="bg-light p-2 rounded">$x^2 + y^2 = z^2$</pre>
                                <p className="mb-0">Результат:</p>
                                <div className="bg-light p-2 rounded">
                                    <Latex>$x^2 + y^2 = z^2$</Latex>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="btn"
                        onClick={() => setShowPreview(!showPreview)}
                        style={{
                            backgroundColor: showPreview ? "#5A3E36" : "#D2C4B3",
                            color: showPreview ? "#fff" : "#5A3E36"
                        }}
                    >
                        {showPreview ? "Скрыть предпросмотр" : "Показать предпросмотр"}
                    </button>
                </div>
                <textarea
                    className="form-control mb-2"
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    required
                />
                {showPreview && (
                    <div className="card p-3 mb-2">
                        <strong>Предпросмотр:</strong>
                        <Latex>{formData.text}</Latex>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <label className="form-label mb-3">Ответы:</label>
                {formData.answers.map((answer, index) => (
                    <div key={index} className="mb-3">
                        <div className="d-flex gap-2 mb-2 align-items-center">
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

export default QuestionForm; 
import React, { useState } from "react";
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import Header from "../components/Header";
import Footer from "../components/Footer";

const FormulasPage = () => {
    const [text, setText] = useState('');
    const [showPreview, setShowPreview] = useState(true);

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    return (
        <div style={{ backgroundColor: "#F7F3EF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />
            <div className="container flex-grow-1 py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <h1 className="mb-4" style={{ color: "#5A3E36" }}>Пример формул</h1>

                        <div
                            className="mb-3"
                            style={{
                                backgroundColor: "#DFF0D8",
                                color: "#5A3E36",
                                borderRadius: "5px",
                                padding: "10px"
                            }}
                        >
                            Для ввода формул используйте LaTeX. Перед и после формулы ставьте знак $. Например: $E=mc^2$
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <h5 className="card-title mb-3" style={{ color: "#5A3E36" }}>Введите текст:</h5>
                                <textarea
                                    className="form-control"
                                    rows="5"
                                    value={text}
                                    onChange={handleTextChange}
                                    style={{
                                        borderRadius: "5px",
                                        border: "1px solid #D2C4B3",
                                        resize: "vertical"
                                    }}
                                />
                            </div>
                        </div>

                        {/* Preview Toggle Button */}
                        <div className="d-flex justify-content-end mb-3">
                            <button
                                className="btn"
                                onClick={() => setShowPreview(!showPreview)}
                                style={{
                                    backgroundColor: "#D2C4B3",
                                    color: "#5A3E36",
                                    borderRadius: "5px",
                                    border: "none"
                                }}
                            >
                                {showPreview ? "Скрыть предпросмотр" : "Показать предпросмотр"}
                            </button>
                        </div>

                        {/* Preview Section */}
                        {showPreview && (
                            <div className="card-body">
                                <h5 className="card-title mb-3" style={{ color: "#5A3E36" }}>Предпросмотр:</h5>
                                <div
                                    className="preview-content p-3"
                                    style={{
                                        backgroundColor: "#fff",
                                        borderRadius: "5px",
                                        border: "1px solid #D2C4B3",
                                        minHeight: "100px"
                                    }}
                                >
                                    <Latex>{text}</Latex>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FormulasPage; 
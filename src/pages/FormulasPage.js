import React, { useState } from "react";
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import Header from "../components/Header";
import Footer from "../components/Footer";

// Link to the package: https://www.npmjs.com/package/react-latex-next?activeTab=readme

// Latex editor: https://latexeditor.lagrida.com/

const FormulasPage = () => {
    const [text, setText] = useState('');
    const [showPreview, setShowPreview] = useState(true);

    const formulaText = `$
\\left\\{
\\begin{aligned}
\\iiint\\limits_V \\nabla \\times \\mathbf{F} \\cdot d\\mathbf{V} &= 
\\oint\\limits_S \\mathbf{F} \\cdot d\\mathbf{S} \\\\[2ex]
\\frac{\\partial^2 \\psi}{\\partial t^2} &= c^2 \\nabla^2 \\psi + 
\\sum_{n=1}^{\\infty} \\frac{(-1)^n}{n!} \\frac{d^n f(x)}{dx^n} \\\\[2ex]
P(A|B) &= \\frac{P(B|A)P(A)}{P(B)} = 
\\frac{P(B|A)P(A)}{\\sum\\limits_{i} P(B|A_i)P(A_i)} \\\\[2ex]
\\mathcal{L}\\{f(t)\\} &= \\int_0^{\\infty} f(t)e^{-st}dt = F(s) \\\\[2ex]
R_{\\mu\\nu} - \\frac{1}{2}Rg_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} &= 
\\frac{8\\pi G}{c^4}T_{\\mu\\nu}
\\end{aligned}
\\right.
$`;

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const insertFormula = () => {
        setText(formulaText);
    };

    const clearText = () => {
        setText('');
    };

    return (
        <div style={{ backgroundColor: "#F7F3EF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />
            <div className="container flex-grow-1 py-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h1 style={{ color: "#5A3E36" }}>Пример формул</h1>
                            <div className="d-flex gap-2">
                                <button
                                    className="btn"
                                    onClick={insertFormula}
                                    style={{
                                        backgroundColor: "#5A3E36",
                                        color: "#fff",
                                        borderRadius: "5px",
                                        border: "none"
                                    }}
                                >
                                    Вставить сложную формулу
                                </button>
                                <button
                                    className="btn"
                                    onClick={clearText}
                                    style={{
                                        backgroundColor: "#D2C4B3",
                                        color: "#5A3E36",
                                        borderRadius: "5px",
                                        border: "none"
                                    }}
                                >
                                    Очистить
                                </button>
                            </div>
                        </div>

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
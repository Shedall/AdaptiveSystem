import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutPage = () => {
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
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <h1 style={{ color: "#5A3E36", marginBottom: "1.5rem" }}>О нас</h1>

                        <div className="card border-0" style={{ backgroundColor: "white", borderRadius: "15px" }}>
                            <div className="card-body">
                                <h2 style={{ color: "#5A3E36", fontSize: "1.5rem", marginBottom: "1rem" }}>
                                    EduFlex - Ваша платформа для онлайн-обучения
                                </h2>

                                <p className="mb-4" style={{ color: "#7A6A63" }}>
                                    EduFlex - это современная образовательная платформа, созданная для того,
                                    чтобы сделать обучение доступным, удобным и эффективным. Мы стремимся
                                    предоставить качественное образование каждому, кто хочет развиваться и
                                    получать новые знания.
                                </p>

                                <h3 style={{ color: "#5A3E36", fontSize: "1.25rem", marginBottom: "1rem" }}>
                                    Наша миссия
                                </h3>
                                <p className="mb-4" style={{ color: "#7A6A63" }}>
                                    Мы верим, что образование должно быть доступным для каждого. Наша цель -
                                    создать платформу, где преподаватели могут делиться своими знаниями,
                                    а студенты - получать качественное образование в удобном для них формате.
                                </p>

                                <h3 style={{ color: "#5A3E36", fontSize: "1.25rem", marginBottom: "1rem" }}>
                                    Преимущества EduFlex
                                </h3>
                                <ul className="list-unstyled" style={{ color: "#7A6A63" }}>
                                    <li className="mb-2">✓ Удобный формат обучения</li>
                                    <li className="mb-2">✓ Качественные материалы</li>
                                    <li className="mb-2">✓ Доступ к курсам 24/7</li>
                                    <li className="mb-2">✓ Профессиональные преподаватели</li>
                                    <li className="mb-2">✓ Постоянное развитие и обновление контента</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AboutPage;
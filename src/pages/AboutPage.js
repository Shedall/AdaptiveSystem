import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutPage = () => {
    return (
        <div style={{ backgroundColor: "#F7F3EF", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Header />
            <div className="container flex-grow-1 py-5">
                <h1 style={{ color: "#5A3E36" }}>О нас</h1>
                {/* Add about content here */}
            </div>
            <Footer />
        </div>
    );
};

export default AboutPage;
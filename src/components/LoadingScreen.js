import React from 'react';

const LoadingScreen = () => {
    return (
        <div
            style={{
                backgroundColor: "#F7F3EF",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000
            }}
        >
            <div
                className="spinner-border"
                style={{
                    color: "#5A3E36",
                    width: "3rem",
                    height: "3rem"
                }}
                role="status"
            >
                <span className="visually-hidden">Loading...</span>
            </div>
            <div
                style={{
                    color: "#5A3E36",
                    marginTop: "1rem",
                    fontSize: "1.2rem"
                }}
            >
                Загрузка...
            </div>
        </div>
    );
};

export default LoadingScreen; 
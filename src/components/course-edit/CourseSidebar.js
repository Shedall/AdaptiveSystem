import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

const CourseSidebar = ({ courseData, isMobile }) => {
    const location = useLocation();
    const { id } = useParams();

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: `/teach/edit-course/${id}`, label: "Редактировать" },
    ];

    const sidebarStyle = isMobile ? {
        width: '100%',
        backgroundColor: "#D2C4B3",
        color: "#5A3E36",
        padding: "10px 20px",
        borderBottom: "1px solid #5A3E36",
        display: "flex",
        alignItems: "center",
        gap: "20px"
    } : {
        width: "250px",
        backgroundColor: "#D2C4B3",
        color: "#5A3E36",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        height: "auto",
    };

    const imageStyle = isMobile ? {
        width: "50px",
        height: "50px",
        objectFit: "cover",
        borderRadius: "5px",
    } : {
        width: "200px",
        height: "200px",
        objectFit: "cover",
        borderRadius: "5px",
        marginBottom: "15px"
    };

    const titleStyle = isMobile ? {
        fontSize: "16px",
        color: "#5A3E36",
        margin: 0,
        flex: 1
    } : {
        fontSize: "16px",
        color: "#5A3E36",
        wordWrap: "break-word",
        marginTop: "15px"
    };

    const navStyle = isMobile ? {
        display: "flex",
        gap: "10px",
        alignItems: "center"
    } : {
        flex: "1",
        marginTop: "20px"
    };

    const linkStyle = (isActiveLink) => ({
        display: "block",
        color: isActiveLink ? "#5A3E36" : "#fff",
        textDecoration: "none",
        fontWeight: isActiveLink ? "bold" : "normal",
        padding: isMobile ? "5px 10px" : "8px 0",
        backgroundColor: isMobile ? (isActiveLink ? "#fff" : "#5A3E36") : "transparent",
        borderRadius: isMobile ? "5px" : "0",
        marginBottom: isMobile ? "0" : "10px",
        fontSize: isMobile ? "14px" : "16px"
    });

    return (
        <div style={sidebarStyle}>
            <img
                src={courseData?.image || '/placeholder.png'}
                alt="Course"
                style={imageStyle}
                onError={(e) => {
                    e.target.src = '/placeholder.png';
                }}
            />
            <h3 style={titleStyle}>
                {courseData?.name || "Loading..."}
            </h3>
            <nav style={navStyle}>
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={linkStyle(isActive(item.path))}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default CourseSidebar; 
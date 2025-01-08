import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import IconButton from '../IconButton';

const CourseSidebar = ({ courseData, isMobile, onEdit, onDelete }) => {
    const location = useLocation();
    const { id } = useParams();

    const isActive = (path) => location.pathname === path;

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
            <div className="d-flex flex-column gap-2 mt-3">
                <IconButton
                    icon="edit_icon.svg"
                    text={isMobile ? "" : "Изменить курс"}
                    onClick={onEdit}
                    variant="secondary"
                    size="sm"
                />
                <IconButton
                    icon="delete_icon.svg"
                    text={isMobile ? "" : "Удалить курс"}
                    onClick={onDelete}
                    variant="danger"
                    size="sm"
                />
            </div>
        </div>
    );
};

export default CourseSidebar; 
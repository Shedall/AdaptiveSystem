import React from 'react';

const IconButton = ({ icon, text, onClick, variant = "primary", className = "", size = "md" }) => {
    const getStyle = () => {
        const baseStyle = {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'opacity 0.2s'
        };

        // Add square aspect ratio for icon-only buttons
        if (!text) {
            baseStyle.width = size === 'sm' ? '32px' : '38px';
            baseStyle.height = size === 'sm' ? '32px' : '38px';
            baseStyle.padding = '0';
        }

        switch (variant) {
            case 'danger':
                return {
                    ...baseStyle,
                    backgroundColor: "#dc3545",
                    color: "#fff"
                };
            case 'secondary':
                return {
                    ...baseStyle,
                    backgroundColor: "#D2C4B3",
                    color: "#5A3E36"
                };
            default:
                return {
                    ...baseStyle,
                    backgroundColor: "#5A3E36",
                    color: "#fff"
                };
        }
    };

    return (
        <button
            className={`btn btn-${size} ${className}`}
            onClick={onClick}
            style={getStyle()}
        >
            {icon && <img src={`/icons/${icon}`} alt="" style={{ width: size === 'sm' ? '14px' : '18px' }} />}
            {text}
        </button>
    );
};

export default IconButton; 
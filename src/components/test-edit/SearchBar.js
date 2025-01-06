import React from 'react';

const SearchBar = ({ value, onChange, onClear }) => {
    return (
        <div className="mb-4 position-relative">
            <input
                type="text"
                className="form-control"
                placeholder="Поиск вопросов..."
                value={value}
                onChange={onChange}
            />
            {value && (
                <button
                    className="btn btn-link position-absolute"
                    style={{
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#5A3E36',
                        textDecoration: 'none'
                    }}
                    onClick={onClear}
                >
                    Очистить
                </button>
            )}
        </div>
    );
};

export default SearchBar; 
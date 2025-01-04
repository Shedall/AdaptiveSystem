import React, { useState } from 'react';

const ContentForm = ({ content, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        label: content?.label || '',
        file: null
    });
    const [currentFileName, setCurrentFileName] = useState(
        content?.file ? content.file.split('/').pop() : ''
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('label', formData.label);
        if (formData.file) {
            data.append('file', formData.file);
        }
        onSave(data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Название материала:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Файл:</label>
                {content && (
                    <div className="mb-2">
                        <small className="text-muted">
                            Текущий файл: <a href={content.file} target="_blank" rel="noopener noreferrer">{currentFileName}</a>
                        </small>
                    </div>
                )}
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                    required={!content} // Required only for new content
                />
                {content && (
                    <small className="text-muted d-block mt-1">
                        Загрузите новый файл только если хотите заменить текущий
                    </small>
                )}
            </div>
            <div className="d-flex gap-2">
                <button type="submit" className="btn" style={{ backgroundColor: "#5A3E36", color: "#fff" }}>
                    {content ? 'Сохранить изменения' : 'Создать'}
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

export default ContentForm; 
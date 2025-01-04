import React, { useState } from 'react';

const ContentForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        label: '',
        file: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('label', formData.label);
        data.append('file', formData.file);
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
                <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                    required
                />
            </div>
            <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">Сохранить</button>
                <button type="button" className="btn btn-secondary" onClick={onCancel}>Отмена</button>
            </div>
        </form>
    );
};

export default ContentForm; 
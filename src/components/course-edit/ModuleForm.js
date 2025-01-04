import React, { useState } from 'react';

const ModuleForm = ({ module, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: module?.name || '',
        description: module?.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Название модуля:</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Описание модуля:</label>
                <textarea
                    className="form-control"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

export default ModuleForm; 
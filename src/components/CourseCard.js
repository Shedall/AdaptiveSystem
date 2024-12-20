import React from 'react';

const CourseCard = ({ course }) => {
  return (
    <div className="card h-100 shadow-sm">
      <img 
        src={course.image || '/placeholder.png'} 
        className="card-img-top" 
        alt={course.name}
        style={{ height: "200px", objectFit: "cover" }}
        onError={(e) => {
          e.target.src = '/placeholder.png';
        }}
      />
      <div className="card-body">
        <h5 className="card-title" style={{ color: "#5A3E36" }}>{course.name}</h5>
        <p className="card-text text-muted">{course.description}</p>
        <div className="d-flex justify-content-between align-items-center">
          {course.category_name && (
            <small className="text-muted">{course.category_name}</small>
          )}
          <small className="text-muted">Автор: {course.author_fio}</small>
        </div>
      </div>
    </div>
  );
};

export default CourseCard; 
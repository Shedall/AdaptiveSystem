import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <Link to={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
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
          {course.category_name && (
            <small className="text-muted">{course.category_name}</small>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard; 
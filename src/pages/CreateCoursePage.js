import React from "react";
import CreateCourse from "../components/Create_Courses";

const CreateCoursePage = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Создать новый курс</h1>
      <CreateCourse />
    </div>
  );
};

export default CreateCoursePage;

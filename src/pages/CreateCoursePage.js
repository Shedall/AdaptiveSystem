import React from "react";
import CreateCourse from "../components/Create_Courses";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CreateCoursePage = () => {
  return (
    <>
      <Header />
    <div className="container mt-5">
      <h1 className="text-center mb-4">Создать новый курс</h1>
      <CreateCourse />
    </div>
    <Footer />
    </>
  );
};

export default CreateCoursePage;

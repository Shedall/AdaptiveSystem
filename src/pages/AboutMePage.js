import React from "react";
import UserInfo from "../components/AboutMe";
import Header from "../components/Header";
import Footer from "../components/Footer";

const UserInfoPage = () => {
  return (
    <>
    <Header/>
    <div className="container mt-5">
      <h1 className="text-center mb-4" style={{  minHeight: "10vh", }}>Профиль пользователя</h1>
      <UserInfo />
    </div>
    <Footer/>
    </>
  );
};

export default UserInfoPage;

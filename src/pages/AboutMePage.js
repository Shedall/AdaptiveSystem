import React from "react";
import UserInfo from "../components/AboutMe";

const UserInfoPage = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Профиль пользователя</h1>
      <UserInfo />
    </div>
  );
};

export default UserInfoPage;

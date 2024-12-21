import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../api";

const UserInfo = () => {

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
  });
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  // Загружаем информацию о пользователе
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await userService.aboutme();
        setUserInfo(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserInfo();
  }, []);

  // Обработчик изменения полей смены пароля
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // Обработчик отправки формы смены пароля
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPasswordSuccess("");
    setIsPasswordLoading(true);

    try {
      await userService.updatepassword(passwordData);
      setPasswordSuccess("Пароль успешно изменён!");
      setPasswordData({ old_password: "", new_password: "" }); 
      setTimeout(() => {
        window.location.reload(); // Перенаправляем на страницу списка курсов
      }, 2000);// Очищаем форму
    } catch (err) {
      setError(err.message || "Ошибка при смене пароля.");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="container mt-5">
    {/* Информация о пользователе */}
    {error && <div className="alert alert-danger">{error}</div>}
    {userInfo && (
      <div className="card shadow mb-4">
        <div className="card-body">
          <h3>ФИО: {userInfo.fio}</h3>
          <p>Email: {userInfo.email}</p>
          {userInfo.image ? (
            <div
              style={{
                width: "100%",
                maxWidth: "600px", // Максимальная ширина изображения
                height: "400px",   // Фиксированная высота контейнера
                overflow: "hidden", // Скрываем выходящее содержимое
                borderRadius: "10px", // Округленные углы (опционально)
                margin: "0 auto",   // Центрируем изображение
                //marginLeft: "auto",  // Выравниваем контейнер по правому краю
                //display: "block",    // Устанавливаем блочное поведение
              }}
            >
              <img
                src={userInfo.image}
                alt="User"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // Делаем изображение адаптивным и обрезаем лишнее
                }}
              />
            </div>
          ) : (
            <p>Изображение не загружено</p>
          )}
        </div>
      </div>
    )}

      {/* Форма для смены пароля */}
      <div className="card shadow">
        <div className="card-body">
          <h3 className="text-center mb-4">Смена пароля</h3>
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-3">
              <label>Старый пароль:</label>
              <input
                type="password"
                name="old_password"
                className="form-control"
                value={passwordData.old_password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Новый пароль:</label>
              <input
                type="password"
                name="new_password"
                className="form-control"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isPasswordLoading}
            >
              {isPasswordLoading ? "Загрузка..." : "Сменить пароль"}
            </button>
          </form>
          {passwordSuccess && (
            <div className="alert alert-success mt-3">{passwordSuccess}</div>
          )}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;

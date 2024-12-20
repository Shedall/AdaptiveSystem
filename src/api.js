const API_BASE_URL = 'http://localhost:8000';

// Универсальная функция для обработки ошибок
const handleErrors = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Ошибка сервера');
  }
  return response.json();
};

// Генерация заголовков
const getHeaders = (isJSON = true) => {
  const headers = {};
  const token = localStorage.getItem("accessToken"); // Токен из localStorage
  console.log("Token", token);
  if (token) {
    headers["Authorization"] = `Token ${token}`; // Используем формат Token
  }
  if (isJSON) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

export const userService = {
  // Авторизация пользователя
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials),
    });
    return handleErrors(response);
  },

  // Регистрация пользователя
  register: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      body: formData,
    });
    return handleErrors(response);
  },
};


export const CourseService = {

  // Создание курса
  createCourse: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/api/courses/`, {
      method: 'POST',
      headers: getHeaders(false), // Без `Content-Type`, т.к. используется `FormData`
      body: formData,
    });
    return handleErrors(response);
  },
};

export default userService;

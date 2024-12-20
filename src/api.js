const API_BASE_URL = 'http://localhost:8000';

const handleErrors = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();

    // Если сервер возвращает объект с полями ошибок
    if (errorData && typeof errorData === "object") {
      throw errorData; // Бросаем весь объект ошибок
    }

    // Если есть "detail"
    throw { detail: errorData.detail || "Ошибка сервера" }; // Оборачиваем detail в объект
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

  aboutme: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/about_me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleErrors(response);
  },

  updatepassword: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/update_password`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(formData),
    });
    return handleErrors(response);
  },
};


export const CourseService = {
  createCourse: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/api/courses/`, {
      method: 'POST',
      headers: getHeaders(false), // Без `Content-Type`, т.к. используется `FormData`
      body: formData,
    });
    return handleErrors(response);
  },

  getCategories: async (searchQuery = '') => {
    const response = await fetch(`${API_BASE_URL}/api/courses/categories/?search=${searchQuery}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleErrors(response);
  },
};

export default userService;

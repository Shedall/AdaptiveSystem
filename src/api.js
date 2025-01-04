const API_BASE_URL = 'http://localhost:8000';

const handleErrors = async (response) => {
  // First check for 204 No Content
  if (response.status === 204) {
    return null;
  }

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

  getCourses: async (searchQuery = '', page = 1) => {
    const response = await fetch(
      `${API_BASE_URL}/api/courses/all/?search=${searchQuery}&page=${page}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );
    return handleErrors(response);
  },

  getMyCourses: async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/courses/my/`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );
    return handleErrors(response);
  },

  getCourseById: async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/api/courses/${id}/`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );
    return handleErrors(response);
  },

  updateCourse: async (id, formData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/courses/${id}/`,
      {
        method: 'PUT',
        headers: getHeaders(false),
        body: formData,
      }
    );
    return handleErrors(response);
  },

  // Module methods
  createModule: async (moduleData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/modules/`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(moduleData),
      }
    );
    return handleErrors(response);
  },

  updateModule: async (id, moduleData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/modules/${id}/`,
      {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(moduleData),
      }
    );
    return handleErrors(response);
  },

  deleteModule: async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/api/modules/${id}/`,
      {
        method: 'DELETE',
        headers: getHeaders(),
      }
    );
    return handleErrors(response);
  },

  // Topic methods
  createTopic: async (topicData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/topics/`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(topicData),
      }
    );
    return handleErrors(response);
  },

  updateTopic: async (id, topicData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/topics/${id}/`,
      {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(topicData),
      }
    );
    return handleErrors(response);
  },

  deleteTopic: async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/api/topics/${id}/`,
      {
        method: 'DELETE',
        headers: getHeaders(),
      }
    );
    return handleErrors(response);
  },

  createContent: async (contentData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/contents/`,
      {
        method: 'POST',
        headers: getHeaders(false),
        body: contentData,
      }
    );
    return handleErrors(response);
  },

  updateContent: async (id, contentData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/contents/${id}/`,
      {
        method: 'PUT',
        headers: getHeaders(false),
        body: contentData,
      }
    );
    return handleErrors(response);
  },

  deleteContent: async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/api/contents/${id}/`,
      {
        method: 'DELETE',
        headers: getHeaders(),
      }
    );
    return handleErrors(response);
  },

  getTopicById: async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/api/topics/${id}/`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );
    return handleErrors(response);
  },
};

export default userService;

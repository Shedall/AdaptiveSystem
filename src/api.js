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
  const token = localStorage.getItem("accessToken");
  if (token) {
    headers["Authorization"] = `Token ${token}`;
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
    const data = await handleErrors(response);

    return {
      token: data.access_token || data.token,
      user: data.user || {
        id: data.id,
        email: data.email,
        fio: data.fio,
        image: data.image
      }
    };
  },

  // Регистрация пользователя
  register: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      body: formData,
    });
    const data = await handleErrors(response);

    return {
      token: data.access_token || data.token,
      user: data.user || {
        id: data.id,
        email: data.email,
        fio: data.fio,
        image: data.image
      }
    };
  },

  aboutme: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/about_me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleErrors(response);
  },

  updateProfile: async (formData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/auth/update_me`,
      {
        method: 'PUT',
        headers: getHeaders(false),
        body: formData,
      }
    );
    const data = await handleErrors(response);
    return {
      id: data.id,
      email: data.email,
      fio: data.fio,
      image: data.image
    };
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
    // Create a new FormData only if there are actual changes
    const formData = new FormData();

    // Only append fields that have values
    if (contentData.get('label')) {
      formData.append('label', contentData.get('label'));
    }

    // Only append file if it exists
    const file = contentData.get('file');
    if (file) {
      formData.append('file', file);
    }

    const response = await fetch(
      `${API_BASE_URL}/api/contents/${id}/`,
      {
        method: 'PATCH',
        headers: getHeaders(false),
        body: formData,
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

  getTeachCourses: async () => {
    const response = await fetch(
      `${API_BASE_URL}/api/courses/my/`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );
    return handleErrors(response);
  },

  createModuleTest: async (testData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/tests/create_module_test/`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(testData),
      }
    );
    return handleErrors(response);
  },

  createEntranceTest: async (testData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/tests/create_entrance_test/`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(testData),
      }
    );
    return handleErrors(response);
  },

  updateTest: async (id, testData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/tests/${id}/`,
      {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(testData),
      }
    );
    return handleErrors(response);
  },

  deleteTest: async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/api/tests/${id}/`,
      {
        method: 'DELETE',
        headers: getHeaders(),
      }
    );
    return handleErrors(response);
  },

  getTestById: async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/api/tests/${id}/`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );
    return handleErrors(response);
  },

  createQuestion: async (questionData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/questions/`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(questionData),
      }
    );
    return handleErrors(response);
  },

  updateQuestion: async (id, questionData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/questions/${id}/`,
      {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(questionData),
      }
    );
    return handleErrors(response);
  },

  deleteQuestion: async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/api/questions/${id}/`,
      {
        method: 'DELETE',
        headers: getHeaders(),
      }
    );
    return handleErrors(response);
  },

  getQuestion: async (id) => {
    if (!id || isNaN(id)) {
      throw new Error('Invalid question ID');
    }
    const response = await fetch(
      `${API_BASE_URL}/api/questions/${id}/`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );
    return handleErrors(response);
  },

  createAnswer: async (answerData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/answers/`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(answerData),
      }
    );
    return handleErrors(response);
  },

  updateAnswer: async (id, answerData) => {
    const response = await fetch(
      `${API_BASE_URL}/api/answers/${id}/`,
      {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify(answerData),
      }
    );
    return handleErrors(response);
  },

  deleteAnswer: async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/api/answers/${id}/`,
      {
        method: 'DELETE',
        headers: getHeaders(),
      }
    );
    return handleErrors(response);
  },
};

export default userService;

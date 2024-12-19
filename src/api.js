const API_BASE_URL = 'http://localhost:8000';

export const userService = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },
  register: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        body: formData,
      });
      return response.json();
    } catch (error) {
      throw error;
    }
  },
};
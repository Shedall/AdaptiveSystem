export const auth = {
    // Get user data
    getUserData: () => {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    },

    // Get token
    getToken: () => {
        return localStorage.getItem('accessToken');
    },

    // Check if user is logged in
    isAuthenticated: () => {
        return !!localStorage.getItem('accessToken');
    },

    // Logout
    logout: () => {
        localStorage.removeItem('userData');
        localStorage.removeItem('accessToken');
    },
};
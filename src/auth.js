export const auth = {
    // Get user data
    getUserData: () => {
        const userData = localStorage.getItem('userData');
        if (!userData) return null;
        try {
            return JSON.parse(userData);
        } catch (e) {
            localStorage.removeItem('userData'); // Clear invalid data
            return null;
        }
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

    // Login
    login: (token, user) => {
        if (!token || !user) return;
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userData", JSON.stringify(user));
    },

    // Update user data
    updateUserData: (userData) => {
        if (!userData) return;
        localStorage.setItem("userData", JSON.stringify(userData));
    }
};
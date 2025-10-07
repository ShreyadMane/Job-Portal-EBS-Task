import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const authService = {
    login: async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
            console.log('Login response:', response.data);
            return response;
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message);
            throw error;
        }
    },
    
    getCurrentUser: () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return Promise.reject(new Error('No token found'));
        }
        return axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default authService;
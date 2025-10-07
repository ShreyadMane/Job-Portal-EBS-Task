import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

const API_URL = '/api/users';

const userService = {
    getAll: () => {
        const token = localStorage.getItem('token');
        return axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    create: (userData) => {
        const token = localStorage.getItem('token');
        return axios.post(API_URL, userData, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    delete: (userId) => {
        const token = localStorage.getItem('token');
        return axios.delete(`${API_URL}/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default userService;
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

const userService = {
    getAll: () => {
        return axios.get(API_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
    },
    create: (userData) => {
        return axios.post(API_URL, userData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
    },
    delete: (userId) => {
        return axios.delete(`${API_URL}/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
    }
};

export default userService;
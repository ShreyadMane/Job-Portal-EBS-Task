import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

const API_URL = '/api/jobs';

const jobService = {
    getAll: () => {
        const token = localStorage.getItem('token');
        return axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    create: (jobData) => {
        const token = localStorage.getItem('token');
        return axios.post(API_URL, jobData, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    update: (id, jobData) => {
        const token = localStorage.getItem('token');
        return axios.put(`${API_URL}/${id}`, jobData, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default jobService;
import axios from "axios"

const axiosClient =  axios.create({
    // baseURL: 'http://localhost:3000',
    baseURL:'https://proj-backend-un8b.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


// ...existing code...

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // or sessionStorage if you use that
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


export default axiosClient;


import axios from "axios"

const axiosClient = axios.create({
    // baseURL: 'http://localhost:3000',
    baseURL: 'https://proj-backend-un8b.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token from localStorage
axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor to handle errors
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Axios error:', error);
        
        // Handle token expiration
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            // You can redirect to login here if needed
        }
        
        return Promise.reject(error);
    }
);

export default axiosClient;


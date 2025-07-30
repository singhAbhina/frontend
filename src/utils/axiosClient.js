import axios from "axios"

const axiosClient =  axios.create({
    // baseURL: 'http://localhost:3000',
    baseURL:'https://proj-backend-un8b.onrender.com',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});


export default axiosClient;


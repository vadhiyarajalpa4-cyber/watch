import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000"
});

API.interceptors.request.use((req) => {
    if (localStorage.getItem('userInfo')) {
        const token = JSON.parse(localStorage.getItem('userInfo')).token;
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
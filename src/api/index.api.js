import axios from "axios";

const apiClient = axios.create({
    //baseURL:"https://api.shareby.in/api/v1/",
    //baseURL:"https://sendfile-backend.onrender.com/api/v1/",
    baseURL:"http://localhost:4000/api/v1/",
    //baseURL:"https://sendfile-backend-development.onrender.com/api/v1",
    //baseURL:"/api/v1/",
    //baseURL:"https://api.shareby.io/api/v1/",
    timeout: 240000,
    withCredentials: true,

})

export default apiClient;
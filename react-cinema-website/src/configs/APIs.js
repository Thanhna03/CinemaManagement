    import axios from "axios";
    // import cookie from "react-cookies";

    // export const BASE_URL = 'http://192.168.1.233:8000/';
    export const BASE_URL = 'http://127.0.0.1:8000/';


    export const endpoints = {
        'movie': 'movie/',

    };  


    // export const authAPI = () => {
    //     const token = cookie.load('token');
    //     console.log("Access Token:", token);  // Log token ra console

    //     return axios.create({
    //         baseURL: BASE_URL,
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         }
    //     });
    // }


    export default axios.create({
        baseURL: BASE_URL
    });
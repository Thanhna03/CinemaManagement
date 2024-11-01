    import axios from "axios";
    import cookie from "react-cookies";

    // export const BASE_URL = 'http://192.168.1.233:8000/';
    // export const BASE_URL = 'http://127.0.0.1:8000/';
    export const BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';


    export const endpoints = {
        'movie': '/api/movie/',
        'user': '/api/users/',
        'signup': '/api/users/',
        'login': '/o/token/',
        'current_user': '/users/current-user/' ,
        'showtime': '/api/showtime/',
        'cinema_hall': '/api/cinema_hall/',
        'movie_create': '/api/movie/',
        'movie_update': (id) => `/api/movie/${id}/`,
        'movie_delete': (id) => `/api/movie/${id}/`,
        'genres': '/api/genres/',
        'users_update': (id) => `/api/users/${id}/`,
        'users_delete': (id) => `/api/users/${id}/`,
        'showtime_update': (id) => `/api/showtime/${id}/`,
        'showtime_delete': (id) => `/api/showtime/${id}/`,
        'showtime_create': '/api/showtime/',
        'booking': '/api/booking/',


    };  


    export const authAPI = () => {
        const token = cookie.load('token');
        console.log("Access Token:", token);  // Log token ra console

        return axios.create({
            baseURL: BASE_URL,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }


    export default axios.create({
        baseURL: BASE_URL
    });



import React, { useReducer, useEffect } from "react";
import HomePages from "./pages/users/HomePages/HomePages";
import { Router } from "./utils/router";
import { Route, Routes } from "react-router-dom";
import MasterLayout from "./pages/users/theme/masterLayout";
import ProfilePages from "./pages/permis/ProfilePages/ProfilePages";
import MovieShowing from './pages/users/Movie/movie_showing';
import MovieUpcoming from './pages/users/Movie/movie_upcoming';
import Login from "./pages/permis/login";
import Signup from "./pages/permis/signup";
import Movie_Management from "./pages/admin/movie/movie_edit";
import SHOWTIME_MANAGE from "./pages/admin/showtime/showtime_edit";
import USER_MANAGE from "./pages/admin/user/user_edit";
import Cinema_Hall from "./pages/users/CinemaHall/CinemaHall";
import MyUserReducer from "./configs/Reducers";
import AdminBooking from './components/Booking/AdminBooking';
import UserBooking from './components/Booking/UserBooking';
import { MyDispatchContext, MyUserContext } from './configs/MyContext';
import cookie from "react-cookies";
import { authAPI, endpoints } from 'configs/APIs';

const userRouter = [
    {
        path: Router.user.HOME,
        element: <HomePages />,
    },
    {
        path: Router.user.PROFILE,
        element: <ProfilePages />,
    },
    {
        path: Router.user.MOVIE_SHOWING,
        element: <MovieShowing />,
    },
    {
        path: Router.user.MOVIE_UPCOMING,
        element: <MovieUpcoming />,
    },
    {
        path: Router.permis.LOGIN,
        element: <Login />,
    },
    {
        path: Router.permis.SIGNUP,
        element: <Signup />,
    },
    {
        path: Router.admin.MOVIE_MANAGE,
        element: <Movie_Management />,
    },
    {
        path: Router.user.CINEMA_HALL,
        element: <Cinema_Hall />,
    },
    {
        path: Router.admin.USER_MANAGE,
        element: <USER_MANAGE />,
    },
    {
        path: Router.admin.SHOWTIME_MANAGE,
        element: <SHOWTIME_MANAGE />,
    },
    {
        path: Router.booking.ADMIN_BOOKING,
        element: <AdminBooking />,
    },
    {
        path: Router.booking.USER_BOOKING,
        element: <UserBooking /> 
    },
];


const RouterCustom = () => {
    const [user, dispatch] = useReducer(MyUserReducer, cookie.load("user") || null);

    useEffect(() => {
        const loadUser = async () => {
            const token = cookie.load('token');
            console.log("Initial load - Token:", token);
            console.log("Initial load - User state:", user);

            if (token) {
                try {
                    const api = authAPI();
                    const res = await api.get(endpoints['current_user']);
                    console.log("API Response:", res.data);

                    dispatch({
                        type: "login",
                        payload: {
                            user: res.data,
                            token: token
                        }
                    });
                } catch (error) {
                    console.error("Error loading user:", error);
                    cookie.remove('token');
                    cookie.remove('user');
                }
            }
        };

        loadUser();
    }, []);

    // Wrap everything in providers
    return (
        <MyUserContext.Provider value={user}>
            <MyDispatchContext.Provider value={dispatch}>
                <MasterLayout>
                    <Routes>
                        {userRouter.map((item, key) => (
                            <Route
                                key={key}
                                path={item.path}
                                element={item.element}
                            />
                        ))}
                    </Routes>
                </MasterLayout>
            </MyDispatchContext.Provider>
        </MyUserContext.Provider>
    );
};

export default RouterCustom;
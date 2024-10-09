import React, { useReducer } from "react";
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
import Cinema_Hall from "./pages/users/CinemaHall/CinemaHall";
import { MyDispatchContext, MyUserContext } from 'configs/MyContext';
import MyUserReducer from "configs/Reducers";

const userRoueter = [
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
];

const renderUserRouter = (user, dispatch) => {
    return (
        <MasterLayout>
            <MyUserContext.Provider value={user}>
                <MyDispatchContext.Provider value={dispatch}>
                    <Routes>
                        {userRoueter.map((item, key) => (
                            <Route key={key} path={item.path} element={item.element} />
                        ))}
                    </Routes>
                </MyDispatchContext.Provider>
            </MyUserContext.Provider>
        </MasterLayout>
    );
};

const RouterCustom = () => {
    const [user, dispatch] = useReducer(MyUserReducer, null);
    return renderUserRouter(user, dispatch);
};

export default RouterCustom;
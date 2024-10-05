// chứa router đến các trang khác nhau mà kh cần render trực tiếp qua App.js

// import { de } from "date-fns/locale";
import React from "react";
import HomePages from "./pages/users/HomePages/HomePages";
import { Router } from "./utils/router";
import { Route, Routes } from "react-router-dom";
import MasterLayout from "./pages/users/theme/masterLayout";
import ProfilePages from "./pages/permis/ProfilePages/ProfilePages";
import MovieShowing from './pages/users/Movie/movie_showing';
import MovieUpcoming from './pages/users/Movie/movie_upcoming';
import Login from "./pages/permis/login";
import Signup from "./pages/permis/signup";
import Movie_Management from "./pages/admin/movie/movie_edit"
import Cinema_Hall from "./pages/users/CinemaHall/CinemaHall"


const renderUserRouter = () => {
    const userRoueter = [
        {
            path: Router.user.HOME,
            element: <HomePages />, //không sử dụng component 
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
    ]

    return (
        <MasterLayout>
            <Routes>
                {userRoueter.map((item, key) => (
                    <Route key={key} path={item.path} element={item.element} />
                ))}
            </Routes>
        </MasterLayout>
    );

    // return (
    //     <Routes>
    //       {userRoueter.map((item, key) => (
    //         <Route
    //           key={key}
    //           path={item.path}
    //           element={
    //             item.usesMasterLayout ? (
    //               <MasterLayout>{item.element}</MasterLayout>
    //             ) : (
    //               item.element
    //             )
    //           }
    //         />
    //       ))}
    //     </Routes>
    //   );
};

const RouterCustom = () => {
    return renderUserRouter();
};

export default RouterCustom;
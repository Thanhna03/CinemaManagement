// chứa router đến các trang khác nhau mà kh cần render trực tiếp qua App.js

// import { de } from "date-fns/locale";
import React from "react";
import HomePages from "./pages/users/HomePages/HomePages";
import { Router } from "./utils/router";
import { Route, Routes } from "react-router-dom";
import MasterLayout from "./pages/users/theme/masterLayout";
import ProfilePages from "./pages/users/ProfilePages/ProfilePages";
import MovieShowing from './pages/users/Movie/movie_showing';

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
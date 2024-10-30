import React, { useContext, useEffect } from "react";
import { memo } from "react";
import "./style.scss";
import { AiFillFacebook, AiFillInstagram, AiOutlineUser, AiOutlineMail } from "react-icons/ai";
import {AiOutlineSetting, AiOutlineHistory,AiOutlineLogout, AiOutlineVideoCamera,AiOutlineCalendar,AiOutlineSchedule } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { Router } from "utils/router";
import 'react-multi-carousel/lib/styles.css';
import cookie from 'react-cookies';
import { MyUserContext, MyDispatchContext } from 'configs/MyContext';

const Header = ({ showCarousel = true }) => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatchContext);
    const navigate = useNavigate();

    const [menu] = React.useState([
        {
            name: "Trang chủ",
            path: Router.user.HOME,
        },
        {
            name: "Phim",
            path: "",
            isShowsSubmenu: false,
            child: [
                {
                    name: "Phim đang chiếu",
                    path: Router.user.MOVIE_SHOWING
                },
                {
                    name: "Phim sắp chiếu",
                    path: Router.user.MOVIE_UPCOMING
                },
            ],
        },
        {
            name: "Rạp/Suất chiếu",
            path: Router.user.CINEMA_HALL,
        },
        {
            name: "Ưu đãi",
            path: Router.user.PROMOTION,
        }
    ]);

    const [currentIndex, setCurrentIndex] = React.useState(0);
    const images = [
        { src: "https://cdn.galaxycine.vn/media/2024/8/13/transformers-2048_1723544458749.jpg", alt: "Placeholder 1" },
        { src: "https://cdn.galaxycine.vn/media/2024/9/12/look-back-3_1726128134652.jpg", alt: "Placeholder 2" },
        { src: "https://cdn.galaxycine.vn/media/2023/10/23/galaxy-ben-tre-1_1698053844082.jpg", alt: "Placeholder 3" },
    ];

    const updateCarousel = (index) => {
        setCurrentIndex(index);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    React.useEffect(() => {
        const interval = setInterval(nextSlide, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        console.log("Header - User context value:", user);
        if (user) {
            console.log("User properties:", Object.keys(user));
            console.log("Username:", user.username);
        }
    }, [user]);

    const handleLogout = () => {
        if (dispatch) {
            dispatch({ type: "logout" });
            cookie.remove('token');
            cookie.remove('user');
            navigate('/dang_nhap');
        }
    };

    const isAdmin = user?.is_staff || user?.is_superuser;

    return (
        <>
            <div className="header_top">
                <div className="container">
                    <div className="row">
                        <div className="col-6 header_top_left">
                            <ul>
                                <li><AiOutlineMail /> cinema@gmail.com</li>
                            </ul>
                        </div>
                        <div className="col-6 header_top_right">
                            <ul>
                                <li>
                                    <Link to={"https://www.facebook.com/"}>
                                        <AiFillFacebook />
                                    </Link>
                                </li>
                                <li>
                                    <Link to={"https://www.instagram.com/"}>
                                        <AiFillInstagram />
                                    </Link>
                                </li>
                                <li>
                                {user ? (
                        <div className="user-menu">
                            <Link to="#">
                                <AiOutlineUser className="mr-2" />
                                <span>Xin chào, {user.username}</span>
                            </Link>
                            <div className="user-dropdown">
                                {isAdmin ? (
                                    // Menu cho Admin
                                    <>
                                        <Link to="/admin_movie" className="dropdown-item">
                                            <AiOutlineVideoCamera />
                                            <span>Quản lý Phim</span>
                                        </Link>
                                        <Link to="/admin/booking" className="dropdown-item">
                                            <AiOutlineCalendar />
                                            <span>Quản lý Đặt vé</span>
                                        </Link>
                                        <Link to="/admin/showtime" className="dropdown-item">
                                            <AiOutlineSchedule />
                                            <span>Quản lý Lịch chiếu</span>
                                        </Link>
                                    </>
                                ) : (
                                    // Menu cho User thường
                                    <>
                                        <Link to="/profile" className="dropdown-item">
                                            <AiOutlineUser />
                                            <span>Thông tin cá nhân</span>
                                        </Link>
                                        <Link to="/booking-history" className="dropdown-item">
                                            <AiOutlineHistory />
                                            <span>Lịch sử đặt vé</span>
                                        </Link>
                                        <Link to="/settings" className="dropdown-item">
                                            <AiOutlineSetting />
                                            <span>Cài đặt</span>
                                        </Link>
                                    </>
                                )}
                                <hr />
                                <button onClick={handleLogout} className="logout-button">
                                    <AiOutlineLogout />
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                            </div>
                                ) : (
                                    <Link to={"/dang_nhap"}>
                                        <AiOutlineUser className="mr-2" />
                                        <span>Sign In</span> 
                                    </Link>
                                )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-xl-3">
                        <div className="header_logo">
                            <h1>CINEMA</h1>
                        </div>
                    </div>
                    <div className="col-xl-6">
                        <nav className="header_menu">
                            <ul>
                                {menu?.map((menu, menuKey) => (
                                    <li key={menuKey} className={menuKey === 0 ? "active": ""}>
                                        <Link to={menu?.path}>{menu?.name}</Link>
                                        {menu.child && (
                                            <ul className="header_menu_dropdown">
                                                {menu.child.map((childItem, childKey) => (
                                                    <li key={`${menuKey}-${childKey}`}>
                                                        <Link to={childItem.path}>{childItem.name}</Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        
                    </div>
                    <div className="col-xl-3">
                    <div className="header_booking"> 
                        <li Link to="#"> 
                            <img src="https://iguov8nhvyobj.vcdn.cloud/media/wysiwyg/news-offers/mua-ve_ngay.png" alt="Mua Vé Ngay" style={{width: '25%', maxWidth: '100px'}} />
                        </li>
                    </div>
                    
                    </div>
                </div>
            </div>
            {showCarousel && (
                 <div className="carousel-container">
                 <div className="carousel" style={{transform: `translateX(-${currentIndex * 100}%)`}}>
                     {images.map((image, index) => (
                         <div className="carousel-item" key={index}>
                             <img src={image.src} alt={image.alt} />
                         </div>
                     ))}
 
                     <div className="carousel-indicators">
                         {images.map((_, index) => (
                             <div key={index} className={`indicator ${index === currentIndex ? 'active' : ''}`} onclick={() => updateCarousel(index)}></div>
                         ))}
                     </div>
 
                 </div>
             </div>
            )}
        </>
    );
};

export default memo(Header);
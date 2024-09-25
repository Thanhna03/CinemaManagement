
import React, { useState, useEffect  } from "react";
import {memo} from "react";
// import { css } from "@emotion/react";
import "./style.scss";
import { AiFillFacebook, AiFillInstagram, AiOutlineUser, AiOutlineMail } from "react-icons/ai";
import {Link} from "react-router-dom";
import { Router } from "utils/router";
// import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';




const Header = ({ showCarousel = true }) => {
    const [menu] = useState([
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
            name: "Rạp",
            path: Router.user.CINEMA_HALL,
        },
        {
            name: "Ưu đãi",
            path: Router.user.PROMOTION,
        }
    ]);

    const [currentIndex, setCurrentIndex] = useState(0);
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

    useEffect(() => {
        const interval = setInterval(nextSlide, 3000);
        return () => clearInterval(interval); // Clear interval when component unmounts
    }, []);

    // const responsive = {
    //     superLargeDesktop: {
    //       breakpoint: { max: 4000, min: 3000 },
    //       items: 5
    //     },
    //     desktop: {
    //       breakpoint: { max: 3000, min: 1024 },
    //       items: 3
    //     },
    //     tablet: {
    //       breakpoint: { max: 1024, min: 464 },
    //       items: 2
    //     },
    //     mobile: {
    //       breakpoint: { max: 464, min: 0 },
    //       items: 1
    //     }
    //   };


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
                                    <Link to={""}>
                                        <AiOutlineUser />
                                    </Link>
                                    <span>Sigin</span>
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
           
           {/* <div>
            <Carousel responsive={responsive}>
                <div>item 1</div>
                <div>item 2</div>
                <div>item 2</div>
                <div>item 2</div>
            </Carousel>;
           </div> */}
        </>
    )
};


export default memo(Header);
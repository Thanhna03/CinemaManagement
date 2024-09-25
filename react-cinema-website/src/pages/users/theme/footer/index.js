
import React from "react";
import {memo} from "react";
import {Link} from "react-router-dom";
import "./style.scss"; 

const Footer = () => {
    return <footer className="footer">
        <div className="container">
            <div className="row">
            <div className="col-lg-4">
                <div className="footer_info">
                    <h1 className="footer_logo">CINEMA</h1>
                    <ul>
                        <li>Địa chỉ: 3/9 Võ Văn Tần, Quận 3</li>
                        <li>Phone: 028.39.333.303</li>
                        <li>Email: hotro@galaxystudio.vn</li>
                    </ul>
                </div>
            </div>
            <div className="col-lg-5">
                <div className="footer_widget">
                    <h6>Góc phim</h6>
                    <ul>
                        <li>
                            <Link to="">Giới thiệu</Link>
                        </li>
                        <li>
                            <Link to="">Các cụm rạp</Link>
                        </li>
                        <li>
                            <Link to="">Phim hay tháng</Link>
                        </li>
                    </ul>
                    <ul>
                        <li>Liên hệ</li>
                        <li>Đóng góp ý kiến</li>
                    </ul>
                </div>
            </div>
            <div className="col-lg-3">
                <div className="footer_widget">
                    <h6>Khuyến mãi & ưu đãi</h6>
                    <p>Đăng kí để nhận ngay</p>
                     <form action="#">
                        <div className="input_group">
                            <input type="text" placeholder="Nhập email"/>
                            <button type="submit" className="button_submit">Đăng ký</button>
                        </div>
                    </form>
                </div>
            </div>
            </div>
        </div>
    </footer>
};

export default memo(Footer); 
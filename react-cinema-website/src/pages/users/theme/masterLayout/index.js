// có thể coi là gói bọc bên ngoài của body => do header và footer không thay đổi

import React from "react";
import {memo} from "react";
import Footer from "../footer";
import Header from "../header";

//masterLayout có thể coi là sự chuyển đổi giữa các trang mà kh cần return từng trang trong index.js
const MasterLayout = ({ children, ...props}) => {
    return (
        <div {...props}>
            <Header />
            {children}
            <Footer /> 
        </div>
    )
};

export default memo(MasterLayout);
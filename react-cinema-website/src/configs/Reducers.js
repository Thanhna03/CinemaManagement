import cookie from 'react-cookies';

const MyUserReducer = (current, action) => {
    console.log("Reducer - Current state:", current);
    console.log("Reducer - Action:", action);

    switch (action.type) {
        case "login":
            // Log để kiểm tra dữ liệu trước khi lưu
            console.log("Login payload:", action.payload);
            
            // Đảm bảo lưu đầy đủ thông tin user vào cookie
            if (action.payload.user) {
                cookie.save('user', action.payload.user, { path: '/' });
                cookie.save('token', action.payload.token, { path: '/' });
            }
            
            return action.payload.user;
            
        case "logout":
            cookie.remove("token", { path: '/' });
            cookie.remove("user", { path: '/' });
            return null;
            
        default:
            return current;
    }
};

export default MyUserReducer;
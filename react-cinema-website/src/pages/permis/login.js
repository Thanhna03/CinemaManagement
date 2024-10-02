import APIs, { authAPI,endpoints } from 'configs/APIs';
import "./style.scss";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import cookie from "react-cookies";
// import { MyDispatchContext} from 'configs/MyContext'


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const login = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await APIs.post(endpoints['login'], {
                'username': email,
                'password': password,
                // 'client_id': process.env.REACT_APP_CLIENT_ID,
                // 'client_secret': process.env.REACT_APP_CLIENT_SECRET,
                'client_id': 'ieYXizKVaptkqlAEmh5QD0QGEDBR6mbTYx92siJY',
                'client_secret': 'LNtjKjG2SMklsMnr55SFkqm3Lxoh98sPnY1gIwcVg5ZofVOwnGvmfkyArMTLzBS0WARxF62u0v5Kgb9HFiFkpv74O29t7RnGWqWsjnD5uW6BJcpYn5nDkEKsNpYPmVrt',
                'grant_type': "password",
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            console.log('Login response:', res);
    
            if (res.status === 200 && res.data.access_token) {
                cookie.save("token", res.data.access_token);
                try {
                    const userdata = await authAPI().get(endpoints['current_user']);
                    cookie.save('user', userdata.data);
                    // dispatch({
                    //     "type": "login",
                    //     "payload": userdata.data
                    // });
                    navigate("/");
                } catch (userError) {
                    console.error("Lỗi khi lấy thông tin người dùng:", userError);
                    setError("Đăng nhập thành công nhưng không thể lấy thông tin người dùng.");
                }
            } else {
                handleLoginError(res.status);
            }
        } catch (ex) {
            console.error("Lỗi tại màn hình đăng nhập:", ex);
            if (ex.response) {
                console.log('Login attempt with:', { email, password });
                handleLoginError(ex.response.status);
            } else {
                setError("Lỗi kết nối, vui lòng thử lại sau.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login();
    };

    const handleLoginError = (status) => {
        switch(status) {
          case 400:
            setError("Sai email hoặc mật khẩu");
            break;
          // Thêm các trường hợp khác
          default:
            setError("Đã xảy ra lỗi, vui lòng thử lại sau");
        }
    };



    return (
    <div className="login-container">
        <div className="login-header">
        <h2>Đăng Nhập Tài Khoản</h2>
        </div>
        {/* {error && (
        <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
        </Alert>
        )} */}
        <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập Email"
            required
            />
        </div>
        <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="password-input">
            <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập Mật khẩu"
                required
            />
            <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            </div>
        </div>
        <button type="submit" className="login-button">
            ĐĂNG NHẬP
        </button>
        </form>
        <div className="forgot-password">
        <a href="/forgot-password">Quên mật khẩu?</a>
        </div>
        <div className="signup-link">
        <p>Bạn chưa có tài khoản?</p>
        <a href="/register">Đăng ký</a>
        </div>
    </div>
    );
};


export default Login;
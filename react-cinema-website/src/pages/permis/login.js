import APIs, { authAPI, endpoints } from 'configs/APIs';
import cookie from "react-cookies";
import "./style.scss";
import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { MyDispatchContext } from 'configs/MyContext';

// import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useContext(MyDispatchContext);
    
    

    const login = useCallback(async () => {
        setLoading(true);
        setMessage({ type: '', content: '' });
        try {
            // Tạo FormData và encode đúng format
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('client_id', 'I1WEfzVEDY5HgycZVTeSG6miBOQQJnwkkmFXBg8U');
            formData.append('client_secret', 'pbkdf2_sha256$870000$7pSZBhMedNb55PhBdu2aFT$zhEIp3XwpAm8jl00mkIdQPtvyc+HPrWWKXvleFk/T5s=');
            formData.append('grant_type', 'password');

            console.log('Sending login request with:', formData.toString());

            let res = await APIs.post(endpoints['login'], formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            console.log('Login response:', res);

            if (res.status === 200 && res.data.access_token) {
                try {
                    const userdata = await APIs.get(endpoints['current_user'], {
                        headers: {
                            'Authorization': `Bearer ${res.data.access_token}`
                        }
                    });
                    
                    console.log("User data received:", userdata.data);

                    // Lưu token vào cookie
                    cookie.save('token', res.data.access_token, { path: '/' });
                    cookie.save('user', userdata.data, { path: '/' });

                    if (typeof dispatch === 'function') {
                        dispatch({
                            type: "login",
                            payload: {
                                user: userdata.data,
                                token: res.data.access_token
                            }
                        });

                        setMessage({ type: 'success', content: 'Đăng nhập thành công!' });
                        
                        setTimeout(() => {
                            if (userdata.data.is_staff || userdata.data.is_superuser) {
                                navigate("/admin_movie");
                            } else {
                                navigate("/");
                            }
                        }, 1000);
                    } else {
                        console.error("dispatch is not a function");
                        setMessage({ type: 'error', content: "Lỗi xử lý đăng nhập" });
                    }
                } catch (userError) {
                    console.error("Error fetching user data:", userError);
                    setMessage({ type: 'error', content: "Không thể lấy thông tin người dùng" });
                }
            }
        } catch (error) {
            console.error("Login error:", error.response?.data);
            if (error.response?.data?.error === 'unsupported_grant_type') {
                setMessage({ type: 'error', content: "Lỗi xác thực, vui lòng thử lại" });
            } else {
                handleLoginError(error.response?.status);
            }
        } finally {
            setLoading(false);
        }
    }, [username, password, dispatch, navigate]);

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login();
    };

    const handleLoginError = (status) => {
        switch(status) {
            case 400:
                setMessage({ type: 'error', content: "Thông tin đăng nhập không hợp lệ" });
                break;
            case 401:
                setMessage({ type: 'error', content: "Tên đăng nhập hoặc mật khẩu không đúng" });
                break;
            case 403:
                setMessage({ type: 'error', content: "Tài khoản của bạn không có quyền truy cập" });
                break;
            default:
                setMessage({ type: 'error', content: "Đăng nhập không thành công. Vui lòng thử lại sau" });
        }
    };

    useEffect(() => {
        if (message.content) {
            const timer = setTimeout(() => {
                setMessage({ type: '', content: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
        console.log("Current user:", cookie.load("user"));
        console.log("Current token:", cookie.load("token"));
    }, [message]);

       

    return (
        <div className="login-container">
            {message.content && (
                <div className={`message-popup ${message.type}`}>
                    {message.content}
                </div>
            )}
            <div className="login-header">
                <h2>Đăng Nhập Tài Khoản</h2>
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Tên đăng nhập</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nhập tên đăng nhập"
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
                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
                </button>
            </form>
            <div className="forgot-password">
                <a href="/forgot-password">Quên mật khẩu?</a>
            </div>
            <div className="signup-link">
                <p>Bạn chưa có tài khoản?</p>
                <Link to="/dang_ky" className="login-link">Đăng ký</Link>
            </div>
        </div>
    );
};

export default Login;
import APIs, { authAPI, endpoints } from 'configs/APIs';
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
            let res = await APIs.post(endpoints['login'], {
                'username': username,
                'password': password,
                'client_id': '4SZjiVJQiZb5RRgvGdFJKigmmSVw3lR3KXDznR7W',
                'client_secret': 'vj1SWDpotikv8feds7HL4kENgpHnAEv8MvIRFJyAzZgnVZATT6boanguGj9zA4PlKXAVS7SCn43qXm7uiaMtGjgDCxM9d5wk7oBhZmDoYuQ99b5IMmJpkQ7Avf2l3wWt',
                'grant_type': "password",
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });


            if (res.status === 200 && res.data.access_token) {
                try {
                    const userdata = await APIs.get(endpoints['current_user'], {
                        headers: {
                            'Authorization': `Bearer ${res.data.access_token}`
                        }
                    });
                    
                    if (typeof dispatch === 'function') {
                        dispatch({
                            "type": "login",
                            "payload": {
                                user: userdata.data,
                                token: res.data.access_token
                            }
                        });
                    } else {
                        console.error("dispatch is not a function");
                    }

                    setMessage({ type: 'success', content: 'Đăng nhập thành công!' });
                    setTimeout(() => {
                        if (userdata.data.is_staff || userdata.data.is_superuser) {
                            navigate("/admin_movie");
                        } else {
                            navigate("/");
                        }
                    }, 2000);


                } catch (userError) {
                    setMessage({ type: 'error', content: "Đăng nhập thành công nhưng không thể lấy thông tin người dùng." });
                }
            } else {
                handleLoginError(res.status);
            }

        } catch (ex) {
            console.error("Lỗi tại màn hình đăng nhập:", ex);
            if (ex.response) {
                handleLoginError(ex.response.status);
            } else {
                setMessage({ type: 'error', content: "Lỗi kết nối, vui lòng thử lại sau." });
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
            setMessage({ type: 'error', content: "Sai tên đăng nhập hoặc mật khẩu" });
            break;
          case 401:
            setMessage({ type: 'error', content: "Không có quyền truy cập" });
            break;
          case 403:
            setMessage({ type: 'error', content: "Tài khoản của bạn đã bị khóa" });
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
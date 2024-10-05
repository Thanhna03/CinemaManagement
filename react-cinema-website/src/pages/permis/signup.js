import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import APIs, { endpoints } from '../../configs/APIs';
import { Eye, EyeOff } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
    });
    const [role, setRole] = useState(3); // Default to 'Khách hàng'
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const nav = useNavigate();

    // const closeModal = async () => {
    //     setShowSuccessModal(false);
    //     nav('/');
    // }

    const closeModal = () => {
        setShowSuccessModal(false);  // Ẩn modal
        setTimeout(() => {
            nav('/');  // Điều hướng sau khi modal đã đóng
        }, 300);  // Trì hoãn 300ms trước khi điều hướng
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            // Kiểm tra các trường bắt buộc
            if (!formData.username || !formData.password || !formData.email) {
                setError('Vui lòng điền đầy đủ thông tin.');
                return;
            }

            // Kiểm tra mật khẩu trùng khớp
            if (formData.password !== formData.confirmPassword) {
                setError('Mật khẩu không khớp.');
                return;
            }

            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('password', formData.password);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('role', role);

            // Hiển thị các thông tin đã có trong form lên console
            for (let [key, value] of formDataToSend.entries()) {
                console.log(`${key}: ${value}`);
            }

            let response = await APIs.post(endpoints['signup'], formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('User registered successfully:', response.data);
            if (response.status === 201) {
                console.log('Tạo tài khoản thành công!');
                setShowSuccessModal(true); // Hiển thị modal thông báo
            }
        } catch (error) {
            console.error('Error while signing up:', error);
            setError('Đăng ký không thành công. Vui lòng thử lại.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="signup-form-container">
            <h2 className="signup-form-title">Đăng Ký Tài Khoản</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSignup} className="signup-form">
                <div className="form-group">
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Nhập tên đăng nhập"
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Nhập Email"
                        className="form-input"
                        required
                    />
                </div>
                <div className="form-group">
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập Mật khẩu"
                            className="form-input"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="password-toggle"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                <div className="form-group">
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Nhập lại mật khẩu"
                            className="form-input"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="password-toggle"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                <div className="form-group terms-group">
                    <label>
                        <input type="checkbox" required /> 
                        Bằng việc đăng ký tài khoản, tôi đồng ý với <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách bảo mật</a> của Cinema.
                    </label>
                </div>
                <button type="submit" className="submit-button">
                    HOÀN THÀNH
                </button>
            </form>
            <div className="login-link-container">
                <p>Bạn đã có tài khoản?</p>
                <Link to="/dang_nhap" className="login-link">Đăng nhập</Link>
            </div>

            <Modal show={showSuccessModal} onHide={closeModal} centered className="registration-success-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Đăng ký thành công</Modal.Title>
                </Modal.Header>
                <Modal.Body>Tài khoản của bạn đã được tạo thành công!</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={closeModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Signup;
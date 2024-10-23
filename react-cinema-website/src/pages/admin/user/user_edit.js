import React, { useState, useEffect } from 'react';
import APIs, { endpoints } from 'configs/APIs';
import "./style.scss";
import { Table, Button, Form } from 'react-bootstrap';
import { Pencil, Trash2, PlusCircle, Eye, EyeOff } from 'lucide-react';

//done nhưng update người dùng phải nhập pass mới update được => kh thể bỏ trống để giữ nguyên pass có sẵn
// và không thể xóa user là admin => có thể chỉnh sửa dưới API (noted)
// không get name role được -> t chịu


const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const ROLES = {
    ADMIN: { id: 1, name: "Admin" },
    CUSTOMER: { id: 3, name: "Customer" }
  };
  const rolesList = Object.values(ROLES);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    role: ROLES.name
  });


  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await APIs.get(endpoints['user']);
      console.log("API Response:", res.data);
      // Kiểm tra nếu data là array
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } 
      // Nếu data nằm trong property results
      else if (res.data.results && Array.isArray(res.data.results)) {
        setUsers(res.data.results);
      }
      // Nếu data là object, chuyển thành array
      else if (typeof res.data === 'object') {
        const usersArray = Object.values(res.data);
        setUsers(usersArray);
      }
    } catch (ex) {
      console.error("Failed to fetch users:", ex);
      setError('Failed to fetch users');
    }
  };

  const handleAdd = () => {
    setCurrentUser(null);
    setFormData({
      username: '',
      password: '',
      email: '',
      first_name: '',
      last_name: '',
      role: ROLES.CUSTOMER.id
    });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      role: user.role || 3,
      // password: users.password || ''
      password: '' 
    });
    setShowPassword(false); // Reset trạng thái hiển thị password
    setShowModal(true);
  };

  //Không thể xóa admin
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await APIs.delete(endpoints['users_delete'](id));
        fetchUser(); // Refresh list after deletion
      } catch (error) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Kiểm tra các trường bắt buộc
      if (!formData.username || (!currentUser && !formData.password) || !formData.email) {
        setError('Vui lòng điền đầy đủ thông tin.');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      if (!currentUser) {
        formDataToSend.append('password', formData.password);
      }
      formDataToSend.append('email', formData.email);
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      formDataToSend.append('role', formData.role);

      if (formData.password) {
        formDataToSend.append('password', formData.password);
      }


      if (currentUser) {
        await APIs.put(endpoints['users_update'](currentUser.id), formDataToSend);
      } else {
        await APIs.post(endpoints['user'], formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      setShowModal(false);
      setError('');
      await fetchUser();
    } catch (error) {
      console.error('Error saving user:', error.response?.data);
      const errorMessage = error.response?.data?.password 
        ? `Lỗi password: ${error.response.data.password[0]}`
        : 'Có lỗi xảy ra. Vui lòng thử lại.';
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };


  const getRoleName = (roleId) => {
    const numericRoleId = Number(roleId);
    const role = rolesList.find(r => r.id === numericRoleId);
    return role ? role.name : 'Unknown';
  };


  return (
    <div className="admin-movie-management">
      <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>
      {error && <div className="error-message mb-4">{error}</div>}
      
      <Button onClick={handleAdd} className="mb-4">
        <PlusCircle className="mr-2" />
        Thêm người dùng mới
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((users) => (
              <tr key={users.id}>
                <td>{users.username}</td>
                <td>{users.first_name}</td>
                <td>{users.last_name}</td>
                <td>{users.email}</td>
                
                {/* <td>{ROLES[Object.keys(ROLES).find(key => ROLES[key].id === users.role)]?.name || 'Unknown'}</td> */}
                <td>{getRoleName(users.role)}</td> 
                
                <td>
                  <Button onClick={() => handleEdit(users)} className="mr-2">
                    <Pencil className="mr-1" /> Sửa
                  </Button>
                  <Button onClick={() => handleDelete(users.id)} variant="destructive">
                    <Trash2 className="mr-1" /> Xóa
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">Không có dữ liệu người dùng</td>
            </tr>
          )}
        </tbody>
      </Table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-popup">
            <div className="modal-header">
              <h2>{currentUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="form-group">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Luôn hiển thị trường password */}
                <Form.Group className="form-group">
                  <Form.Label>
                    Password {currentUser ? '(Để trống nếu không muốn thay đổi)' : '(Bắt buộc)'}
                  </Form.Label>
                  <div className="password-input-wrapper">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required={!currentUser}
                      placeholder={currentUser ? "Nhập password mới nếu muốn thay đổi" : "Nhập password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>Role</Form.Label>
                  <Form.Control
                    as="select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    {rolesList.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Button type="submit" className="submit-button">
                  {currentUser ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      )}
  </div>
  );
};

export default AdminUserManagement;
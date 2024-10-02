import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./style.scss";
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';

const AdminMovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
    if (isAdmin) {
      fetchMovies();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    try {
      const response = await axios.get('/api/check-admin');
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/login');
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await axios.get('/api/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const handleAdd = () => {
    setCurrentMovie(null);
    setShowModal(true);
  };

  const handleEdit = (movie) => {
    setCurrentMovie(movie);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      try {
        await axios.delete(`/api/movies/${id}`);
        fetchMovies();
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const movieData = Object.fromEntries(formData.entries());

    try {
      if (currentMovie) {
        await axios.put(`/api/movies/${currentMovie.id}`, movieData);
      } else {
        await axios.post('/api/movies', movieData);
      }
      setShowModal(false);
      fetchMovies();
    } catch (error) {
      console.error('Error saving movie:', error);
    }
  };

  if (!isAdmin) {
    return <div>Đang kiểm tra quyền truy cập...</div>;
  }

  return (
    <div className="admin-movie-management">
      <h1 className="text-2xl font-bold mb-4">Quản lý phim</h1>
      <Button onClick={handleAdd} className="mb-4">
        <PlusCircle className="mr-2" />
        Thêm phim mới
      </Button>
      <Table>
        <thead>
          <tr>
            <th>Tên phim</th>
            <th>Đạo diễn</th>
            <th>Năm sản xuất</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.title}</td>
              <td>{movie.director}</td>
              <td>{movie.year}</td>
              <td>
                <Button onClick={() => handleEdit(movie)} className="mr-2">
                  <Pencil className="mr-1" /> Sửa
                </Button>
                <Button onClick={() => handleDelete(movie.id)} variant="destructive">
                  <Trash2 className="mr-1" /> Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4">
            {currentMovie ? 'Chỉnh sửa phim' : 'Thêm phim mới'}
          </h2>
          <Form.Group>
            <Form.Label>Tên phim</Form.Label>
            <Form.Control
              type="text"
              name="title"
              defaultValue={currentMovie?.title}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Đạo diễn</Form.Label>
            <Form.Control
              type="text"
              name="director"
              defaultValue={currentMovie?.director}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Năm sản xuất</Form.Label>
            <Form.Control
              type="number"
              name="year"
              defaultValue={currentMovie?.year}
              required
            />
          </Form.Group>
          <Button type="submit" className="mt-4">
            {currentMovie ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminMovieManagement;
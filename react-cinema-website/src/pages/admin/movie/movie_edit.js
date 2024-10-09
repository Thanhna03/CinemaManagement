import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import APIs, { endpoints } from 'configs/APIs';
import "./style.scss";
import { Table, Button, Form } from 'react-bootstrap';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';

const AdminMovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, []);

  const fetchMovies = async () => {
    try {
      let res = await APIs.get(endpoints['movie']);
      console.log("API Response:", res.data);
      setMovies(res.data.results);
    } catch (ex) {
      console.error("Failed to fetch movies:", ex);
    }
  };

  const fetchGenres = async () => {
    try {
      let res = await APIs.get(endpoints['genres']); 
      setGenres(res.data);
    } catch (ex) {
      console.error("Failed to fetch genres:", ex);
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
        await APIs.delete(endpoints['movie_delete'](id));
        fetchMovies();
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const selectedGenres = Array.from(event.target.genre.selectedOptions, option => option.value);
    formData.delete('genre');
    selectedGenres.forEach(genre => formData.append('genre', genre));

    try {
      if (currentMovie) {
        await APIs.put(endpoints['movie_update'](currentMovie.id), formData);
      } else {
        await APIs.post(endpoints['movie_create'], formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      setShowModal(false);
      fetchMovies();
    } catch (error) {
      console.error('Error saving movie:', error);
    }
  };

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
            <th>Thể loại</th>
            <th>Ngày khởi chiếu</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.name}</td>
              <td>{movie.genre_names.join(", ")}</td>
              <td>{movie.release_date}</td>
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-popup">
            <div className="modal-header">
              <h2>{currentMovie ? 'Chỉnh sửa phim' : 'Thêm phim mới'}</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="form-group">
                  <Form.Label>Tên phim</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    defaultValue={currentMovie?.name}
                    required
                  />
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Label>Mô tả phim</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    defaultValue={currentMovie?.description}
                    required
                  />
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Label>Thể loại</Form.Label>
                  <select
                    name="genre"
                    multiple
                    required
                    defaultValue={currentMovie?.genre_ids || []}
                    className="form-control"
                  >
                    {genres.map(genre => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Label>Ngày khởi chiếu</Form.Label>
                  <Form.Control
                    type="date"
                    name="release_date"
                    defaultValue={currentMovie?.release_date}
                    required
                  />
                </Form.Group>
                {!currentMovie && (
                  <Form.Group className="form-group">
                    <Form.Label>Poster phim</Form.Label>
                    <Form.Control
                      type="file"
                      name="poster"
                      accept="image/*"
                      required
                    />
                  </Form.Group>
                )}
                <Button type="submit" className="submit-button">
                  {currentMovie ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMovieManagement;
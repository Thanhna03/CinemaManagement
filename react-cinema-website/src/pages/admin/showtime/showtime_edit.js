import React, { useState, useEffect } from 'react';

import APIs, { endpoints } from 'configs/APIs';
import "./style.scss";
import { Table, Button, Form } from 'react-bootstrap';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';

const AdminShowtimeManagement = () => {
  const [showtime, setShowtime] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentShowtime, setCurrentShowtime] = useState(null);
  const [movies, setMovies] = useState([]);
  const [cinemaHalls, setCinemaHalls] = useState([]);
 

  useEffect(() => {
    fetchShowtime();
    fetchMoviesAndHalls();
    fetchCinemaHalls();
  }, []);

  const fetchShowtime = async () => {
    try {
      const res = await APIs.get(endpoints['showtime']);
      console.log("Raw response:", res);
      console.log("Showtime data:", res.data);
  
      // Kiểm tra và set dữ liệu đúng format
      const showtimeData = Array.isArray(res.data) ? res.data : res.data.results;
      setShowtime(showtimeData);
    } catch (error) {
      console.error("Error fetching showtime:", error);
    }
  };

  const fetchMoviesAndHalls = async () => {
    try {
      console.log("Fetching movies and halls...");
      const [moviesRes] = await Promise.all([
        APIs.get(endpoints['movie']),
        // APIs.get(endpoints['cinema_hall'])
      ]);

      // console.log("Halls response:", hallsRes.data);
      setMovies(moviesRes.data.results);
      // setCinemaHalls(hallsRes.data.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const fetchCinemaHalls = async () => {
    try {
      const response = await APIs.get(endpoints['cinema_hall']);
      console.log("Cinema halls response:", response.data);
      
      // API trả về array trực tiếp nên không cần .results
      setCinemaHalls(response.data);
    } catch (error) {
      console.error('Error fetching cinema halls:', error);
      alert('Không thể tải danh sách rạp. Vui lòng thử lại sau.');
    }
  };

  const handleAdd = () => {
    setCurrentShowtime(null);
    setShowModal(true);
  };

  const handleEdit = (showtime) => {
    // Set currentShowtime với đầy đủ thông tin
    setCurrentShowtime({
      ...showtime,
      movie: showtime.movie?.id || showtime.movie, // Lưu id của phim
      cinemaHall: showtime.cinemaHall?.id || showtime.cinemaHall // Lưu id của rạp
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa suất chiếu này?')) {
      try {
        await APIs.delete(endpoints['showtime_delete'](id));
        fetchShowtime();
      } catch (error) {
        console.error('Error deleting showtime:', error);
      }
    }
  };

  // Hoặc nếu muốn fetch lại toàn bộ data sau khi cập nhật
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const data = {
      movie: formData.get('movie'),
      cinemaHall: formData.get('cinemaHall'),
      showtime_date: formData.get('showtime_date'),
      start_time: formData.get('start_time'),
      end_time: formData.get('end_time')
    };
  
    try {
      if (currentShowtime) {
        await APIs.put(endpoints['showtime_update'](currentShowtime.id), data);
      } else {
        await APIs.post(endpoints['showtime'], data);
      }
      
      // Fetch lại data sau khi cập nhật
      await fetchShowtime();
      
      setShowModal(false);
      setCurrentShowtime(null);
    } catch (error) {
      console.error('Error saving showtime:', error);
      alert('Có lỗi xảy ra khi lưu suất chiếu');
    }
  };



  const getMovieName = (movieId) => {
    const movie = movies.find(m => m.id === Number(movieId));
    return movie?.name || movieId;
  };

  const getCinemaHallName = (hallId) => {
    const hall = cinemaHalls.find(h => h.id === Number(hallId));
    return hall?.name || hallId;
  };

  return (
    <div className="admin-movie-management">
      <h1 className="text-2xl font-bold mb-4">Quản lý suất chiếu</h1>
      <Button onClick={handleAdd} className="mb-4">
        <PlusCircle className="mr-2" />
        Thêm suất chiếu mới
      </Button>
      <Table>
        <thead>
          <tr>
            <th>Tên phim</th>
            <th>Rạp</th>
            <th>Ngày chiếu</th>
            <th>Thời gian bắt đầu</th>
            <th>Thời gian kết thúc</th>
          </tr>
        </thead>
        <tbody>
          {showtime && showtime.length > 0 ? (
            showtime.map((item) => (
              <tr key={item.id}>
                <td>{getMovieName(item.movie)}</td>
                <td>{getCinemaHallName(item.cinemaHall)}</td>
                <td>
                  {new Date(item.showtime_date).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit', 
                    year: 'numeric'
                  })}
                </td>
                <td>
                  {new Date(`2000-01-01T${item.start_time}`).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </td>
                <td>
                  {new Date(`2000-01-01T${item.end_time}`).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  })}
                </td>
                <td>
                  <Button onClick={() => handleEdit(item)} className="me-2">
                    <Pencil /> Sửa
                  </Button>
                  <Button onClick={() => handleDelete(item.id)} variant="danger">
                    <Trash2 /> Xóa
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">Không có dữ liệu</td>
            </tr>
          )}
        </tbody>
      </Table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-popup">
            <div className="modal-header">
              <h2>{currentShowtime ? 'Chỉnh sửa suất chiếu' : 'Thêm suất chiếu mới'}</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <Form onSubmit={handleSubmit}>

              <Form.Group className="form-group">
                <Form.Label>Tên phim</Form.Label>
                <Form.Select
                  name="movie"
                  value={currentShowtime?.movie || ''}
                  onChange={(e) => setCurrentShowtime({
                    ...currentShowtime,
                    movie: e.target.value
                  })}
                  required
                >
                  <option value="">Chọn phim</option>
                  {movies.map(movie => (
                    <option key={movie.id} value={movie.id}>
                      {movie.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="form-group">
                <Form.Label>Rạp</Form.Label>
                <Form.Select
                  name="cinemaHall"
                  value={currentShowtime?.cinemaHall || ''}
                  onChange={(e) => setCurrentShowtime({
                    ...currentShowtime,
                    cinemaHall: e.target.value
                  })}
                  required
                >
                  <option value="">Chọn rạp</option>
                  {cinemaHalls.map(hall => (
                    <option key={hall.id} value={hall.id}>
                      {hall.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>Ngày chiếu</Form.Label>
                  <Form.Control
                    type="date"
                    name="showtime_date"
                    defaultValue={currentShowtime?.showtime_date ? new Date(currentShowtime.showtime_date).toISOString().split('T')[0] : ''}
                    min={new Date().toISOString().split('T')[0]} // Giới hạn chọn từ ngày hiện tại
                    required
                  />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>Thời gian bắt đầu</Form.Label>
                  <Form.Control
                    type="time"
                    name="start_time"
                    defaultValue={currentShowtime?.start_time} 
                    required
                  />
                </Form.Group>

                <Form.Group className="form-group">
                  <Form.Label>Thời gian kết thúc</Form.Label>
                  <Form.Control
                    type="time"
                    name="end_time"
                    defaultValue={currentShowtime?.end_time} 
                    required
                  />
                </Form.Group>

                <Button type="submit" className="submit-button">
                  {currentShowtime ? 'Cập nhật' : 'Thêm mới'}
                </Button>
              </Form>
            </div>
          </div>
        </div>
      )}
    </div>

   
  );
};

export default AdminShowtimeManagement;







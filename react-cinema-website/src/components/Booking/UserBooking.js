import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import APIs, { endpoints } from 'configs/APIs';
import './style.scss';
import { MyUserContext } from 'configs/MyContext';

const UserBooking = () => {
    const { showtimeId } = useParams();
    const navigate = useNavigate();
    const [showtimeDetails, setShowtimeDetails] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [bookingId, setBookingId] = useState(null);
    const user = useContext(MyUserContext);

    useEffect(() => {
        fetchShowtimeDetails();
        fetchMoviesAndHalls();
        fetchCinemaHalls();
    }, [showtimeId]);

    const fetchShowtimeDetails = async () => {
        try {
            const response = await APIs.get(`${endpoints['showtime']}${showtimeId}/`);
            setShowtimeDetails(response.data);
        } catch (error) {
            console.error('Error fetching showtime:', error);
        }
    };

    const handleSeatSelect = (seat) => {
        const newSelectedSeats = selectedSeats.includes(seat)
            ? selectedSeats.filter(s => s !== seat)
            : [...selectedSeats, seat];
        
        setSelectedSeats(newSelectedSeats);
        calculateTotal(newSelectedSeats);
    };

    const renderSeats = () => {
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        const seatsPerRow = 15;
    
        return rows.map(row => (
            <div key={row} className="seat-row">
                <span className="row-label">{row}</span>
                {[...Array(seatsPerRow)].map((_, index) => {
                    const seatNumber = `${row}${index + 1}`;
                    return (
                        <button
                            key={seatNumber}
                            className={`seat ${selectedSeats.includes(seatNumber) ? 'selected' : ''}`}
                            onClick={() => handleSeatSelect(seatNumber)}
                        >
                            {index + 1}
                        </button>
                    );
                })}
            </div>
        ));
    };

    const calculateTotal = (seats) => {
        setTotalPrice(seats.length * 50000); 
    };

    const handleBooking = async () => {
        try {
            // if (!user) {
            //     // Nếu chưa đăng nhập, chuyển đến trang login
            //     navigate('/dang_nhap', {
            //         state: { from: `/booking/${showtimeId}` }
            //     });
            //     return;
            // }

            if (!selectedSeats.length) {
                alert('Vui lòng chọn ghế!');
                return;
            }

            const bookingData = {
                showtime: showtimeId, 
                seats: selectedSeats.join(','),  
                status: 'pending'
            };

            console.log('Booking data:', bookingData); // Kiểm tra dữ liệu trước khi gửi

            const response = await APIs.post(endpoints['booking'], JSON.stringify(bookingData), {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 201) {
                // Lưu thông tin booking để dùng ở trang thanh toán
                const paymentInfo = {
                    movieInfo: {
                        name: getMovieName(showtimeDetails?.movie),
                        showtime: `${showtimeDetails?.start_time} - ${showtimeDetails?.end_time}`,
                        date: formatDate(showtimeDetails?.showtime_date),
                        cinema: getCinemaHallName(showtimeDetails?.cinemaHall)
                    },
                    seats: selectedSeats,
                    totalPrice: totalPrice,
                    bookingId: response.data.id
                };

                // Chuyển đến trang thanh toán
                navigate('/payment', { 
                    state: { paymentInfo } 
                });
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            
            if (error.response) {
                // Log chi tiết lỗi từ server
                console.error('Server response:', error.response.data);
                alert(`Lỗi: ${error.response.data.message || 'Không thể tạo đặt vé'}`);
            } else {
                alert('Có lỗi xảy ra khi đặt vé. Vui lòng thử lại!');
            }
        }
    };

    const checkSeatStatus = async (seatNumber) => {
        try {
            const response = await APIs.get(`${endpoints['booking']}/check-seat/?showtime=${showtimeId}&seat=${seatNumber}`);
            return response.data.isOccupied;
        } catch (error) {
            console.error('Error checking seat status:', error);
            return false;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
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

    const [movies, setMovies] = useState([]);
    const getMovieName = (movieId) => {
        const movie = movies.find(m => m.id === Number(movieId));
        return movie?.name || movieId;
    };

    const [cinemaHalls, setCinemaHalls] = useState([]);
    const getCinemaHallName = (hallId) => {
        const hall = cinemaHalls.find(h => h.id === Number(hallId));
        return hall?.name || hallId;
    };

    return (
        <div className="user-booking">
            <div className="booking-info">
                <ul>
                    <li>Tên phim: {getMovieName(showtimeDetails?.movie)}</li>
                    <li>Suất chiếu: {showtimeDetails?.start_time} - {showtimeDetails?.end_time}</li>
                    <li>Ngày chiếu: {formatDate(showtimeDetails?.showtime_date)}</li>
                    <li>Rạp: {getCinemaHallName(showtimeDetails?.cinemaHall)}</li>
                </ul>
            </div>

            <div className="screen-container">
                <div className="screen"/>
            </div>

            <div className="seating-layout">
                {renderSeats()}
            </div>

            <div className="booking-summary">
                <h3>Thông tin đặt vé</h3>
                <div className="summary-content">
                    <div className="selected-seats">
                        <span>Ghế đã chọn:</span>
                        <span className="seats-list">
                            {selectedSeats.join(', ') || 'Chưa chọn ghế'}
                        </span>
                    </div>
                    <div className="total-price">
                        <span>Tổng tiền:</span>
                        <span className="price">
                            {totalPrice.toLocaleString('vi-VN')} VND
                        </span>
                    </div>
                </div>
                <button 
                    className="confirm-button"
                    disabled={selectedSeats.length === 0}
                    onClick={handleBooking}
                >
                    Tiến hành thanh toán
                </button>
            </div>

            <div className="seat-legend">
                <div className="legend-item">
                    <div className="seat-example available"></div>
                    <span>Ghế trống</span>
                </div>
                <div className="legend-item">
                    <div className="seat-example occupied"></div>
                    <span>Ghế đã đặt</span>
                </div>
            </div>
        </div>
    );
};

export default UserBooking;
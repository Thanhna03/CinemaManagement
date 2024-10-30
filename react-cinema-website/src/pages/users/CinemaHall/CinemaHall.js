import React, { useState, useEffect } from 'react';
import APIs, { endpoints } from 'configs/APIs';
import './style.scss';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const MovieShowtimes = () => {
    const [selectedCinemaHall, setselectedCinemaHall] = useState([]);
    const [cinema_hall, setCinema_hall] = useState([]);
    const [showtime, setShowtimes] = useState([]);
    const [movies, setMovies] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');  
    const [selectedDate, setSelectedDate] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        fetchCinemas();
        fetchMovies();
    }, []);

    useEffect(() => {
        if (selectedCinemaHall?.id) {
            const formattedDate = formatSelectedDate(selectedDate);
            console.log("Fetching showtimes for date:", formattedDate);
            fetchShowtimes(selectedCinemaHall.id, formattedDate);
        }
    }, [selectedCinemaHall, selectedDate]);

    useEffect(() => {
        console.log("Selected date changed:", selectedDate.toISOString());
    }, [selectedDate]);
    


    const fetchCinemas = async () => {
        try {
            const res = await APIs.get(endpoints['cinema_hall']);
            console.log("API Response:", res.data);

            if (Array.isArray(res.data)) {
                setCinema_hall(res.data);
            } 
            
            else if (res.data.results && Array.isArray(res.data.results)) {
                setCinema_hall(res.data.results);
            }
           
            else if (typeof res.data === 'object') {
              const cinemaHallArray = Object.values(res.data);
              setCinema_hall(cinemaHallArray);
            }
        } catch (err) {
            console.error("Failed to fetch cinemaHall:", err);
            setError('Failed to fetch cinemaHall');
        }
    }

    const fetchShowtimes = async (cinemaHallId, date) => {
        try {
            console.log(`Fetching showtimes with URL: ${endpoints['showtime']}?cinema_hall=${cinemaHallId}&date=${date}`);
            const res = await APIs.get(`${endpoints['showtime']}?cinema_hall=${cinemaHallId}&date=${date}`);
            
            console.log("Raw Showtime Response:", res.data);
            
            let showtimeData;
            if (Array.isArray(res.data)) {
                showtimeData = res.data;
            } else if (res.data.results && Array.isArray(res.data.results)) {
                showtimeData = res.data.results;
            } else {
                showtimeData = [];
            }

            // Log processed data
            console.log("Processed Showtime Data:", showtimeData);
            
            setShowtimes(showtimeData);
        } catch (err) {
            console.error("Error fetching showtimes:", err);
            setError('Failed to fetch showtimes');
            setShowtimes([]);
        }
    };




    const fetchMovies = async () => {
        try {
          const res = await APIs.get(endpoints['movie']); 
          console.log("Movies API Response:", res.data); 
          let moviesArray = [];
          
          if (Array.isArray(res.data)) {
            moviesArray = res.data;
          } 
          else if (res.data.results && Array.isArray(res.data.results)) {
            moviesArray = res.data.results;
          }
          else if (typeof res.data === 'object') {
            moviesArray = Object.values(res.data);
          }
      
          const moviesData = {}; 
          moviesArray.forEach(movie => {
            if (movie && movie.id) {
              moviesData[movie.id] = movie;
            }
          });
          
          console.log("Processed Movies Data:", moviesData);
          setMovies(moviesData);
      
        } catch (err) {
          console.error("Failed to fetch movies:", err);
        }
    }

    const formatTime = (timeString) => {
        if (!timeString) return '';
        try {
            const [hours, minutes] = timeString.split(':');
            return `${hours}:${minutes}`;
        } catch (error) {
            console.error("Error formatting time:", error);
            return timeString;
        }
    };

    const groupShowtimesByMovie = (showtimes) => {
        if (!Array.isArray(showtimes) || !selectedCinemaHall) {
            return [];
        }

        // Format selected date for comparison
        const selectedDateStr = formatSelectedDate(selectedDate);
        console.log("Filtering showtimes for date:", selectedDateStr);

        // Filter showtimes
        const filteredShowtimes = showtimes.filter(showtime => {
            // Extract just the date part from showtime_date
            const showtimeDate = showtime.showtime_date.split('T')[0];
            const cinemaHallId = String(showtime.cinemaHall || showtime.cinema_hall);
            const selectedCinemaId = String(selectedCinemaHall.id);

            const isMatchingDate = showtimeDate === selectedDateStr;
            const isMatchingCinema = cinemaHallId === selectedCinemaId;

            console.log("Showtime comparison:", {
                id: showtime.id,
                showtimeDate,
                selectedDateStr,
                cinemaHallId,
                selectedCinemaId,
                isMatchingDate,
                isMatchingCinema
            });

            return isMatchingDate && isMatchingCinema;
        });

        // Group by movie
        const groupedShowtimes = {};
        
        filteredShowtimes.forEach(showtime => {
            const movieId = showtime.movie;
            const movie = movies[movieId];
            
            if (!movie) return;
            
            if (!groupedShowtimes[movieId]) {
                groupedShowtimes[movieId] = {
                    movie: movie,
                    times: []
                };
            }
            
            groupedShowtimes[movieId].times.push({
                id: showtime.id,
                start_time: formatTime(showtime.start_time),
                end_time: formatTime(showtime.end_time)
            });
        });

        return Object.values(groupedShowtimes);
    };

    if (error) return <div>Error: {error}</div>;

    const generateDateRange = () => {
        const dates = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        
        for (let i = 0; i < 10; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const formatButtonDate = (date) => {
        // Ngày/tháng
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    };

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();
    };

    const formatDayName = (date) => {
        if (isToday(date)) return 'Hôm Nay';
        
        const dayNames = {
            0: 'Chủ Nhật',
            1: 'Thứ Hai',
            2: 'Thứ Ba',
            3: 'Thứ Tư',
            4: 'Thứ Năm',
            5: 'Thứ Sáu',
            6: 'Thứ Bảy'
        };
        
        return dayNames[date.getDay()];
    };

    const formatSelectedDate = (date) => {
        // Format date in YYYY-MM-DD without timezone offset
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const dateRange = generateDateRange();
    const groupedShowtimes = groupShowtimesByMovie(showtime);

    const handleShowtimeClick = (showtimeId) => {
        navigate(`/booking/${showtimeId}`);
    };

    return (
        <div className="movie-showtime-wrapper">

            {/* Left side - Cinema Info */}
            <div className="cinema-info">
                <h2>{selectedCinemaHall?.name || "Chọn rạp chiếu"}</h2>
                {selectedCinemaHall && (
                    <>
                        <p className="address">
                            <span>Địa chỉ:</span> {selectedCinemaHall.location}
                        </p>
                    </>
                )}
            </div>
    
            {/* Right side - Cinema Select */}
            <div className="cinema-select-container">
                <div 
                    className="cinema-select-header"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>{selectedCinemaHall ? selectedCinemaHall.name : 'Select a cinema'}</span>
                    <ChevronDown className={`chevron ${isOpen ? 'open' : ''}`} />
                </div>
                {isOpen && (
                    <ul className="cinema-select-options">
                        {cinema_hall.map((cinema_hall) => (
                            <li 
                                key={cinema_hall.id}
                                onClick={() => {
                                    setselectedCinemaHall(cinema_hall);
                                    setIsOpen(false);
                                }}
                                className={cinema_hall.id === selectedCinemaHall?.id ? 'selected' : ''}
                            >
                                {cinema_hall.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

             {/* Showtimes Display Section */}
             {selectedCinemaHall && (
                <div className="showtimes-container">
                    <h3>Lịch chiếu phim</h3>
                    <div className="date-navigation">
                        {generateDateRange().map((date) => (
                            <button 
                                key={date.getTime()}
                                className={
                                    selectedDate.getDate() === date.getDate() &&
                                    selectedDate.getMonth() === date.getMonth()
                                        ? 'active'
                                        : ''
                                }
                                onClick={() => setSelectedDate(date)}
                            >
                                <div>{formatDayName(date)}</div>
                                <div>{formatButtonDate(date)}</div>
                            </button>
                        ))}
                    </div>

                    <div className="movies-grid">
                        {showtime.length > 0 ? (
                            groupShowtimesByMovie(showtime).map((item) => (
                                item && item.movie && item.times.length > 0 && (
                                    <div key={`movie-${item.movie.id}`} className="movie-card">
                                        <div className="movie-poster">
                                            <img src={item.movie.poster_img} alt={item.movie.name} className="movie-poster" />
                                        </div>
                                        <div className="movie-info">
                                            <h4>{item.movie.name}</h4>
                                            <div className="showtime-section">
                                            <div className="showtime-slots">
                                                {item.times.map((time) => (
                                                    <button 
                                                        key={`time-${time.id}`} 
                                                        className="time-slot"
                                                        onClick={() => handleShowtimeClick(time.id)} 
                                                    >
                                                        {time.start_time}
                                                    </button>
                                                ))}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            ))
                        ) : (
                            <div className="no-showtimes">
                                Không có suất chiếu nào cho ngày đã chọn
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieShowtimes;
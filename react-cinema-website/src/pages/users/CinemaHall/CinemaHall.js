import React, { useState, useEffect } from 'react';
import './style.scss';

const MovieTheaterPage = () => {
    const [theaters, setTheaters] = useState([]);
    const [selectedTheater, setSelectedTheater] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        // Fetch movies based on selectedCity, selectedTheater, and selectedDate
        // Update movies state
    }, [selectedCity, selectedTheater, selectedDate]);

    return (
        <div className="movie-theater-page">
        <header className="header">
            <h1>{selectedTheater}</h1>
            <p>Địa chỉ: 116 Nguyễn Du, Quận 1, Tp.HCM</p>
            <p>Hotline: 1900 2224</p>
        </header>
        
        <div className="theater-selector">
            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
            <option>TP Hồ Chí Minh</option>
            {/* Add more cities */}
            </select>
            <select value={selectedTheater} onChange={(e) => setSelectedTheater(e.target.value)}>
            <option>Galaxy Nguyễn Du</option>
            {/* Add more theaters */}
            </select>
        </div>

        <section className="movie-section">
            <h2>PHIM</h2>
            <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <MovieList movies={movies} />
        </section>
        </div>
    );
    };

    const DateSelector = ({ selectedDate, onDateChange }) => {
    // Implement date selection component
    };

    const MovieList = ({ movies }) => {
    return (
        <div className="movie-list">
        {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
        ))}
        </div>
    );
    };

    const MovieCard = ({ movie }) => {
    return (
        <div className="movie-card">
        <img src={movie.poster} alt={movie.title} />
        <div className="movie-info">
            <h3>{movie.title}</h3>
            <span className="rating">{movie.rating}</span>
            <span className="age-rating">{movie.ageRating}</span>
        </div>
        </div>
    );
};

export default MovieTheaterPage;
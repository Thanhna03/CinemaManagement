
import React from "react";
import { useState, useEffect } from 'react';
import APIs, { endpoints } from 'configs/APIs';
import "./style.scss";
import { Link } from "react-router-dom";

const MovieShowingPage = () => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        let res = await APIs.get(endpoints['movie']);
        console.log("API Response:", res.data);
        
        // Lấy ngày hiện tại
        const today = new Date();
        
        // Lọc phim sắp chiếu
        const futureMovies = res.data.results.filter(movie => {
          const releaseDate = new Date(movie.release_date);
          return releaseDate > today;
        });
        
        setUpcomingMovies(futureMovies);
      } catch (ex) {
        console.error("Failed to fetch movies:", ex);
      }
    };

    loadMovies();
  }, []);

  console.log("Current upcoming movies:", upcomingMovies);

  return (
    <section className="movie-section">
      <h2 className="movie-section__title">PHIM</h2>
      <nav className="nav-tabs">
          <Link to="/phim_dang_chieu" className="nav-item ">Đang chiếu</Link>
          <div className="nav-item active">Sắp chiếu</div>
          <div className="nav-item">Toàn quốc</div>
      </nav>
      {upcomingMovies && upcomingMovies.length > 0 ? (
        <div className="movie-cards">
            {upcomingMovies.map((movie) => (
                <div key={movie.id} className="movie-card">
                      {movie.poster_img && (
                        <img src={movie.poster_img} alt={movie.name} className="movie-poster" />
                    )}
                    <div className="movie-info">
                      <h3>{movie.name}</h3>
                      {movie.genre_names && movie.genre_names.length > 0 && (
                          <p>Thể loại: {movie.genre_names.join(", ")}</p>
                      )}
                        {movie.release_date && (
                              <p>Ngày khởi chiếu: {new Date(movie.release_date).toLocaleDateString('vi-VN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            })}</p>
                            )}
                    </div>
                </div>
            ))}
        </div>
    ) : (
        <p>Không có kết quả phù hợp</p>
    )}
    </section>
  );
};


export default MovieShowingPage;




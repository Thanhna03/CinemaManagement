import React, { useState, useEffect } from "react";
import APIs, { endpoints } from 'configs/APIs';
import "./style.scss";
import { Link } from "react-router-dom";
import MoviePopup from "./Movie_info_popup/movie_info_popup";

const MovieShowingPage = () => {
  const [nowShowingMovies, setNowShowingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        let res = await APIs.get(endpoints['movie']);
        console.log("API Response:", res.data);  
        
        // Get current date
        const today = new Date();
        
        // Filter currently showing movies
        const currentMovies = res.data.results.filter(movie => {
          const releaseDate = new Date(movie.release_date);
          return releaseDate <= today;
        });
        
        setNowShowingMovies(currentMovies);
      } catch (ex) {
        console.error("Failed to fetch movies:", ex);
      }
    };

    loadMovies();
  }, []);

  console.log("Current now showing movies:", nowShowingMovies);

  const openMoviePopup = (movie) => {
    setSelectedMovie(movie);
  };

  const closeMoviePopup = () => {
    setSelectedMovie(null);
  };

  return (
    <section className="movie-section">
      <h2 className="movie-section__title">PHIM</h2>
      <nav className="nav-tabs">
        <div className="nav-item active">Đang chiếu</div>
        <Link to="/phim_sap_chieu" className="nav-item">Sắp chiếu</Link>
        <div className="nav-item">Toàn quốc</div>
      </nav>
      {nowShowingMovies && nowShowingMovies.length > 0 ? (
        <div className="movie-cards">
          {nowShowingMovies.map((movie) => (
            <div 
              key={movie.id} 
              className="movie-card cursor-pointer"
              onClick={() => openMoviePopup(movie)}
            >
              {movie.poster_img && (
                <img src={movie.poster_img} alt={movie.name} className="movie-poster" />
              )}
              <div className="movie-info">
                <h3>{movie.name}</h3>
                {movie.genre_names && movie.genre_names.length > 0 && (
                  <p>Thể loại: {movie.genre_names.join(", ")}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Không có kết quả phù hợp</p>
      )}
      {selectedMovie && (
        <MoviePopup movie={selectedMovie} onClose={closeMoviePopup} />
      )}
    </section>
  );
};

export default MovieShowingPage;
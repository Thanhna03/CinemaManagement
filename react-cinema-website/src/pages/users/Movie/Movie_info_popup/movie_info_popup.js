import React from 'react';
import { X } from 'lucide-react';
import './style.scss';

const MoviePopup = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="movie-popup__overlay">
      <div className="movie-popup__content">
        <button onClick={onClose} className="movie-popup__close-btn">
          <X size={24} />
        </button>
        <div className="movie-popup__body">
          <div className="movie-popup__poster-container">
            <img 
              src={movie.poster_img || "/api/placeholder/300/450"} 
              alt={movie.name} 
              className="movie-popup__poster"
            />
          </div>
          <div className="movie-popup__info">
            <h2 className="movie-popup__title">{movie.name}</h2>
            {movie.genre_names && movie.genre_names.length > 0 && (
              <p className="movie-popup__genre">
                <strong>Thể loại:</strong> {movie.genre_names.join(", ")}
              </p>
            )}

            {movie.release_date && (
              <p className="movie-popup__release-date">
                <strong>Ngày khởi chiếu:</strong> {new Date(movie.release_date).toLocaleDateString('vi-VN')}
              </p>
            )}

            {movie.description && (
              <div className="movie-popup__description">
                <strong>Mô tả:</strong>
                <p>{movie.description}</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePopup;
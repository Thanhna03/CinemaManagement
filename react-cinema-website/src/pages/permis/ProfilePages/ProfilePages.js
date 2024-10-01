import React from "react";
import {memo} from "react";
import { BrowserRouter as  useParams } from 'react-router-dom';
import APIs, { endpoints } from 'configs/APIs';
import "./style.scss";


const ProfilePage = () => {
    const { id } = useParams();
    const [movie, setMovie] = React.useState(null);
  
    React.useEffect(() => {
      const loadMovieDetails = async () => {
        try {
          const res = await APIs.get(`${endpoints['movie']}/${id}`);
          setMovie(res.data);
        } catch (ex) {
          console.error("Failed to fetch movie details:", ex);
        }
      };
  
      loadMovieDetails();
    }, [id]);
  
    if (!movie) return <div>Loading...</div>;
  
    return (
      <div className="movie-profile">
        <h1>{movie.title}</h1>
        <img src={movie.poster} alt={movie.title} />
        <p><strong>Genre:</strong> {movie.genre}</p>
        <p><strong>Release Date:</strong> {movie.release_date}</p>
        <p><strong>Description:</strong> {movie.description}</p>
        {/* Thêm các thông tin khác của phim tại đây */}
      </div>
    );
  };

export default memo(ProfilePage);
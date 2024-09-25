import React from "react";
import {memo} from "react";
import { useState, useEffect } from 'react';
import APIs, { endpoints } from 'configs/APIs';
import "./style.scss";

const HomePages = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const loadMovies = async () => {
            try {
                let res = await APIs.get(endpoints['movie']);
                console.log("API Response:", res.data);
                setMovies(res.data.results); // Set the movies from the 'results' array
            } catch (ex) {
                console.error("Failed to fetch movies:", ex);
            }
        };

        loadMovies();
    }, []);

    console.log("Current movies state:", movies);
    // console.log(movies.length);

    return (
        <>
            <div className="style">
                <div className="movie-list">
                    <h2>PHIM NỔI BẬT</h2>
                    {movies && movies.length > 0 ? (
                        <div className="movie-cards">
                            {movies.map((movie) => (
                                <div key={movie.id} className="movie-card">
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
                </div>
            </div>
        </>
    );
}

export default memo(HomePages);
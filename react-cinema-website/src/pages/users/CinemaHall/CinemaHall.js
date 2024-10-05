// import React, { useState, useEffect } from 'react';
// import { format, addDays } from 'date-fns';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import APIs, { endpoints } from 'configs/APIs';
// import './style.scss';
// import { ChevronDown } from 'lucide-react';


// const MovieShowtimes = ({ cinemaHallId }) => {
//     const [selectedCinemaHall, setselectedCinemaHall] = useState([]);
//     const [cinema_hall, setcinema_hall] = useState([]);
//     const [movies, setMovies] = useState([]);
//     const [showtime, setShowtime] = useState([]);
//     const [isOpen, setIsOpen] = useState(false);
//     const [error, setError] = useState(null);  

//     useEffect(() => {
//         const fetchCinemas = async () => {
//             try {
//                 setIsLoading(true);
//                 const response = await APIs.get(endpoints['api/cinema_hall']); // Adjust the URL as needed
//                 if (!response.ok) {
//                 throw new Error('Failed to fetch cinema halls');
//                 }
//                 const data = await response.json();
//                 setcinema_hall(data);
//                 setselectedCinemaHall(data[0]); // Set the first cinema as default
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setIsLoading(false);
//             }
//         }

//         fetchCinemas();
//     }, []);

//     if (isLoading) return <div>Loading...</div>;
//     if (error) return <div>Error: {error}</div>;


//     const handleMovieClick = (movie) => {
//     setSelectedMovie(movie.id === selectedMovie?.id ? null : movie);
//     };

//     return (
//         <div className="cinema-select-container">
//       <div 
//         className="cinema-select-header"
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span>{selectedCinemaHall ? selectedCinemaHall.name : 'Select a cinema'}</span>
//         <ChevronDown className={`chevron ${isOpen ? 'open' : ''}`} />
//       </div>
//       {isOpen && (
//         <ul className="cinema-select-options">
//           {cinema_hall.map((cinema_hall) => (
//             <li 
//               key={cinema_hall.id}
//               onClick={() => {
//                 setselectedCinemaHall(cinema_hall);
//                 setIsOpen(false);
//               }}
//               className={cinema_hall.id === selectedCinemaHall?.id ? 'selected' : ''}
//             >
//               {cinema_hall.name}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>

//     );
// };

// export default MovieShowtimes;
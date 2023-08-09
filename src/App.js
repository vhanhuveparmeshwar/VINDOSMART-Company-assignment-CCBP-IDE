import React, { useState, useEffect } from "react";
import "./App.css";

const API_KEY = "d02ff04f2a239bed0ea226d9e303b02f";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [minRating, setMinRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}&page=${currentPage}&sort_by=${sortBy}&vote_average.gte=${minRating}`
      );
      const data = await response.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [currentPage, sortBy, minRating]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    fetchMovies();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleRatingChange = (event) => {
    setMinRating(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="heading">Movie Search App</h1>
        <form onSubmit={handleSearchSubmit}>
          <input
            className="search-input"
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="button" type="submit">
            Search
          </button>
        </form>
        <label>
          Sort by:
          <select value={sortBy} onChange={handleSortChange}>
            <option value="popularity.desc">Popularity</option>
            <option value="vote_average.desc">Rating</option>
            <option value="release_date.desc">Release Date</option>
          </select>
        </label>
        <label>
          Min Rating:
          <input
            className="rating-box"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={minRating}
            onChange={handleRatingChange}
          />
        </label>
      </header>
      <main>
        {loading ? (
          <div className="loader"></div>
        ) : (
          <ul className="movie-list">
            {movies.map((movie) => (
              <li key={movie.id} className="movie-item">
                <img
                  className="image"
                  src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                  alt={movie.title}
                />

                <div className="movie-details">
                  <h2 className="movie-title">{movie.title}</h2>
                  <p className="release-date">
                    Release Date: {movie.release_date}
                  </p>
                  <p className="rating">Rating: {movie.vote_average}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

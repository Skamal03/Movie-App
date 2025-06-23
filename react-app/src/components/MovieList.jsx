import React, { useEffect, useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import '../style/cardlist.css';

const API_BASE_URL = "http://localhost:8080";

const pageConfig = {
  "/": {
    containerClass: "movies",
    endpoint: "/movies/top-rated",
    hasLoadMore: false,
    title: "Top Rated Movies",
  },
  "/movies": {
    containerClass: "movies",
    endpoint: "/movies/top-rated",
    hasLoadMore: true,
    title: "All Movies",
  },
  "/action": {
    containerClass: "action",
    endpoint: "/movies/discover/action",
    hasLoadMore: true,
    title: "Action Movies",
  },
  "/adventure": {
    containerClass: "adventure",
    endpoint: "/movies/discover/adventure",
    hasLoadMore: true,
    title: "Adventure Movies",
  },
  "/comedy": {
    containerClass: "comedy",
    endpoint: "/movies/discover/comedy",
    hasLoadMore: true,
    title: "Comedy Movies",
  },
  "/war": {
    containerClass: "war",
    endpoint: "/movies/discover/war",
    hasLoadMore: true,
    title: "War Movies",
  },
  "/drama": {
    containerClass: "drama",
    endpoint: "/movies/discover/drama",
    hasLoadMore: true,
    title: "Drama Movies",
  },
  "/horror": {
    containerClass: "horror",
    endpoint: "/movies/discover/horror",
    hasLoadMore: true,
    title: "Horror Movies",
  },
  "/tvshows": {
    containerClass: "tv-shows",
    endpoint: "/movies/tv/top-rated",
    hasLoadMore: true,
    title: "Top TV Shows",
  },
  "/alltime": {
    containerClass: "all-time",
    endpoint: "/movies/top-rated",
    hasLoadMore: true,
    title: "All-Time Best Movies",
  },
  "/thisyear": {
    containerClass: "year",
    endpoint: "/movies/this-year",
    hasLoadMore: true,
    title: "Best Movies of This Year",
  },
  "/trendingtoday": {
    containerClass: "Trending-today",
    endpoint: "/movies/trending/day",
    hasLoadMore: true,
    title: "Trending Today",
  },
  "/thisweek": {
    containerClass: "week",
    endpoint: "/movies/trending/week",
    hasLoadMore: true,
    title: "Trending This Week",
  },
};

function MovieList() {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [config, setConfig] = useState(null);

  // Fetch movies data
  const loadMovies = useCallback(
    async (page) => {
      if (!config) return;
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`${API_BASE_URL}${config.endpoint}?page=${page}`);
        const data = await response.json();
        setMovies((prev) => (page === 1 ? data.results : [...prev, ...data.results]));
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError(true);
      }
      setLoading(false);
    },
    [config]
  );

  // Update config and reset when path changes
  useEffect(() => {
    const currentConfig = pageConfig[path];
    if (currentConfig) {
      setConfig(currentConfig);
      setMovies([]); // Reset movie list on route change
      setCurrentPage(1);
    }
  }, [path]);

  // Load movies when config or page changes
  useEffect(() => {
    if (config) {
      loadMovies(currentPage);
    }
  }, [config, currentPage, loadMovies]);

  const isTVPage = path === "/tvshows";

  return (
    <section className="movie-list container py-5 text-center text-white">
      <h2 className="mb-4">{config?.title || "Movies"}</h2>

      <div className={`d-flex justify-content-center gap-4 flex-wrap ${config?.containerClass}`}>
        {error ? (
          <p className="text-danger fs-2">Failed to load movies. Please try again later.</p>
        ) : (
          movies.map((movie) => {
            if (!movie.poster_path) return null;
            const title = movie.title || movie.name;
            const to = isTVPage
              ? `/tv-details/${movie.id}`
              : `/movie-details/${movie.id}`;

            return (
              <div key={movie.id} className="movie-card">
                <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={title}
                    className="movie-img"
                    loading="lazy"
                  />
                  <h3>{title}</h3>
                  <p>Rating: {movie.vote_average.toFixed(1)}</p>
                </Link>
              </div>
            );
          })
        )}
      </div>

      {config?.hasLoadMore && !error && (
        <div className="text-center mt-4">
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="btn btn-danger px-3 py-2 fw-bold"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
}

export default MovieList;

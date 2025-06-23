import React, { useState } from "react";
import '../style/banner.css';

function Banner() {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      window.location.href = `/search?query=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <div className="banner text-center text-white py-5">
      <div className="banner-content container">
        <h1 className="display-2">Discover Your Favorite Movies</h1>
        <p className="lead">Explore the world of movies and TV shows.</p>
        <form className="search-bar d-flex justify-content-center gap-2 mt-4" onSubmit={handleSearch}>
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-btn fw-bold" id="searchBtn">
            Search
          </button>
        </form>
      </div>
    </div>
  );
}

export default Banner;

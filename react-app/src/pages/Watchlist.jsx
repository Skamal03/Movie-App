// Watchlist.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import Footer from "../components/Footer";
import "../style/style.css";

function Watchlist() {
  const [watchlistData, setWatchlistData] = useState({ movies: [], tvshows: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login required");
      navigate("/login", { replace: true });
      return;
    }

    fetch("http://localhost:8080/api/watchlist", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setWatchlistData({
          movies: data.movies || [],
          tvshows: data.tvshows || [],
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching watchlist:", err);
        setLoading(false);
      });
  }, [navigate]);

  const handleRemove = async (type, id) => {
    const token = localStorage.getItem("token");
    const confirmed = window.confirm("Remove this from your watchlist?");
    if (!confirmed) return;

    const res = await fetch(`http://localhost:8080/api/watchlist/${type}/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    if (res.ok) {
      setWatchlistData((prev) => ({
        ...prev,
        [type === "movie" ? "movies" : "tvshows"]: prev[
          type === "movie" ? "movies" : "tvshows"
        ].filter((item) => item.itemId !== id),
      }));
    } else {
      alert("Failed to remove from watchlist.");
    }
  };

  if (loading) {
    return <div className="text-white text-center p-5">Loading...</div>;
  }

  return (
    <>
      <Header />
      <SideMenu />

      <h1 className="wlheading p-3 fw-bold text-white">My Watchlist</h1>

      <div className="watchlistcontainer p-5" id="watchlistcontainer">
        <h2 className="text-white">Movies</h2>
        <div className="d-flex flex-wrap gap-3">
          {watchlistData.movies.map((m) => (
            <div key={m.itemId} className="movie-card" data-id={m.itemId} data-type="movie">
              <Link to={`/movie-details/${m.itemId}`} style={{ textDecoration: "none" }}>
                <img src={`https://image.tmdb.org/t/p/w200${m.posterPath}`} alt={m.title} />
                <h3>{m.title}</h3>
              </Link>
              <button
                className="remove-btn m-2"
                onClick={() => handleRemove("movie", m.itemId)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <h2 className="text-white mt-5">TV Shows</h2>
        <div className="d-flex flex-wrap gap-3">
          {watchlistData.tvshows.map((m) => (
            <div key={m.itemId} className="movie-card" data-id={m.itemId} data-type="tv">
              <Link to={`/tv-details/${m.itemId}`} style={{ textDecoration: "none" }}>
                <img src={`https://image.tmdb.org/t/p/w200${m.posterPath}`} alt={m.title} />
                <h3>{m.title}</h3>
              </Link>
              <button
                className="remove-btn m-2" 
                onClick={() => handleRemove("tv", m.itemId)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Watchlist;

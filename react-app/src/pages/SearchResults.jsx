import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

import Header from "../components/Header";
import Footer from "../components/Footer";
import SideMenu from "../components/SideMenu";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery().get("query") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError(null);

    fetch(`http://localhost:8080/movies/search?query=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        console.log("Fetched results:", data); // 🔍 debug
        setResults(data.results || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <>
      <Header />
      <SideMenu />

      <div className="top d-flex justify-content-between align-items-center m-4">
        <h1 className="mb-4 text-white">
          Search Results for "<span>{query}</span>"
        </h1>
        <Link
          to="/"
          className="btn btn-danger fw-bold text-white"
          style={{ backgroundColor: "#ff6347", borderRadius: "10px" }}
        >
          ← Home
        </Link>
      </div>

      <section className="container py-5">
        <div className="d-flex flex-wrap gap-4 justify-content-center" id="resultsContainer">
          {loading && <p className="text-white">Loading...</p>}
          {error && <p className="text-white">Error: {error}</p>}
          {!loading && !error && results.length === 0 && (
            <p className="text-white">No results found.</p>
          )}
          {!loading &&
            !error &&
            results.map((item) => {
              if (!item.poster_path || !item.id) return null;

              const title = item.title || item.name || "No Title";

              const type =
                item.media_type ||
                (item.first_air_date ? "tv" : "movie");

              const detailPage =
                type === "tv"
                  ? `/tv-details/${item.id}`
                  : `/movie-details/${item.id}`;

              return (
                <div key={item.id} className="movie-card" style={{ width: 200 }}>
                  <Link
                    to={detailPage}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={title}
                      style={{ width: "200px", borderRadius: "10px" }}
                      loading="lazy"
                    />
                    <h5 className="mt-2 text-white text-center">{title}</h5>
                  </Link>
                </div>
              );
            })}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default SearchResults;

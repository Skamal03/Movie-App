import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import Footer from "../components/Footer";

const TVShowDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [show, setShow] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8080/movies/tv/details/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch TV show details."))
      .then(data => {
        setShow(data);
        if (data.seasons.length > 0) {
          const seasonNum = data.seasons[0].season_number;
          setSelectedSeason(seasonNum);
          loadEpisodes(data.id, seasonNum);
        }
      })
      .catch(err => setError(err.toString()));
  }, [id]);

  const loadEpisodes = (tvId, seasonNumber) => {
    fetch(`http://localhost:8080/movies/tv/${tvId}/season/${seasonNumber}`)
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch season details."))
      .then(season => setEpisodes(season.episodes || []))
      .catch(() => setEpisodes([]));
  };

  const handleAddToWatchlist = () => {
    if (!token) {
      alert('Please log in to add to your watchlist.');
      navigate('/login');
      return;
    }

    fetch('http://localhost:8080/api/watchlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        itemId: show.id,
        mediaType: 'tv',
        title: show.name,
        posterPath: show.poster_path,
        overview: show.overview
      })
    })
      .then(res => res.json())
      .then(() => alert('Added to watchlist!'))
      .catch(() => alert('Failed to add to watchlist'));
  };

  return (
    <>
      <Header />
      <SideMenu />

      <div className="top d-flex justify-content-between align-items-center m-4">
        <button
          className="home btn btn-danger fw-bold text-white"
          style={{ backgroundColor: '#ff6347', borderRadius: '10px' }}
          onClick={() => navigate('/')}>
        Back to Home
        </button>
      </div>

      <div className="text-white p-4 position-relative container" style={{ maxWidth: '1400px' }}>
        {error && <p>{error}</p>}

        {!show && !error && <p>Loading TV show details...</p>}

        {show && (
          <>
            <h2 className="text-center mb-5 fw-bold">{show.name}</h2>

            <div className="row gx-5">
              <div className="col-12 col-md-4 text-center mb-4 mb-md-0">
                <img
                  src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                  alt={show.name}
                  className="img-fluid rounded"
                  style={{ maxWidth: '90%' }}
                />
                <p className="mt-3 px-4 text-warning"><em>{show.tagline || ''}</em></p>
              </div>

              <div className="col-12 col-md-8 px-md-4">
                <p><strong>First Air Date:</strong> {show.first_air_date || 'N/A'}</p>
                <p><strong>Status:</strong> {show.status || 'N/A'}</p>
                <p><strong>Language:</strong> {show.original_language?.toUpperCase() || 'N/A'}</p>
                <p><strong>Genres:</strong> {show.genres?.map(g => g.name).join(', ') || 'N/A'}</p>

                <div className="mt-4">
                  <h5 className="fw-bold mb-2">Overview:</h5>
                  <p className="text-light">{show.overview || 'No overview available.'}</p>
                </div>

                <button
                  className="addwatchlist btn btn-warning fw-bold mb-3 w-100 w-sm-auto"
                  onClick={handleAddToWatchlist}
                >
                  + Add to Watchlist
                </button>

                <div className='py-5'>
                  <label htmlFor="seasonSelect" className="mb-2 fs-5"><strong>Seasons:</strong></label>
                  <select
                    id="seasonSelect"
                    className="form-select"
                    style={{
                      backgroundColor: '#292626',
                      color: 'white',
                      border: '1px solid #ff6347',
                      borderRadius: '5px',
                      maxWidth: '300px'
                    }}
                    value={selectedSeason}
                    onChange={(e) => {
                      const newSeason = parseInt(e.target.value);
                      setSelectedSeason(newSeason);
                      loadEpisodes(id, newSeason);
                    }}
                  >
                    {show.seasons.map(season => (
                      <option key={season.season_number} value={season.season_number}>
                        Season {season.season_number}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <h4>Episodes</h4>
              {episodes.length === 0 ? (
                <p>No episodes found.</p>
              ) : (
                <div className="d-flex flex-wrap gap-3">
                  {episodes.map(ep => (
                    <div
                      key={ep.id}
                      className="episode p-3 flex-fill"
                      style={{
                        border: '1px solid #ff6347',
                        borderRadius: '8px',
                        minWidth: '250px',
                        textAlign: 'center'
                      }}
                    >
                      <h5>Episode {ep.episode_number}: {ep.name}</h5>
                      <p><strong>Air Date:</strong> {ep.air_date || 'N/A'}</p>
                      <p className="text-start">{ep.overview || 'No overview available.'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default TVShowDetails;

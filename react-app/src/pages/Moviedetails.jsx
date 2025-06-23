import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideMenu from '../components/SideMenu';
import '../style/style.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('Movie ID not found in URL.');
      return;
    }

    fetch(`http://localhost:8080/movies/details/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch movie details.');
        return res.json();
      })
      .then(setMovie)
      .catch((err) => setError(err.message));
  }, [id]);

  const handleAddToWatchlist = () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Login required');

    const body = {
      itemId: movie.id,
      mediaType: movie.media_type || 'movie',
      title: movie.title || movie.name,
      posterPath: movie.poster_path,
      overview: movie.overview,
    };

    fetch('http://localhost:8080/api/watchlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => alert(data.message || 'Added!'))
      .catch(() => alert('Error adding to watchlist'));
  };

  const handleStream = () => {
    const player = document.createElement('div');
    player.innerHTML = `
      <div class="video-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; justify-content:center; align-items:center; z-index:9999;">
        <video id="videoPlayer" controls width="80%" style="outline: none;">
          <source src="http://localhost:8080/stream/${movie.id}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
        <button onclick="this.parentElement.remove()" style="position:absolute; top:20px; right:30px; font-size:25px; color:white; background:none; border:none; cursor:pointer;">&times;</button>
        <button onclick="document.getElementById('videoPlayer').requestFullscreen()" style="position:absolute; bottom:20px; right:30px; font-size:16px; color:white; background:#333; border:none; padding:8px 12px; cursor:pointer;">Fullscreen</button>
      </div>
    `;
    document.body.appendChild(player);
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
          Back To Home
        </button>
      </div>

      <div className="movie-details" id="movieDetails">
        {error && <p className="text-white">{error}</p>}
        {!movie && !error && <p>Loading movie details...</p>}
        {movie && (
            <div className="text-white p-4 position-relative container" style={{ maxWidth: '1400px' }}>
                <h2 className="text-center mb-5 fw-bold">{movie.title}</h2>

                <div className="row gx-5">
                <div className="col-12 col-md-4 text-center mb-lg-5 mb-md-3 mt-lg-5">
                    <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="img-fluid rounded"
                    style={{ maxWidth: '90%' }}
                    />
                    <p className="mt-3 px-4 text-warning">
                    <em>{movie.tagline || ''}</em>
                    </p>
                </div>

                <div className="col-12 col-md-8 px-md-4 my-lg-5">
                    <p><strong>Genres:</strong> {movie.genres?.map((g) => g.name).join(', ') || 'N/A'}</p>
                    <p><strong>Production:</strong> {movie.production_companies?.map((c) => c.name).join(', ') || 'N/A'}</p>
                    <p><strong>Overall Rating:</strong> {movie.vote_average?.toFixed(1) || 'N/A'}</p>
                    <p><strong>Language:</strong> {movie.original_language?.toUpperCase() || 'N/A'}</p>
                    <p><strong>Duration:</strong> {movie.runtime ? `${movie.runtime} mins` : 'N/A'}</p>
                    <div className="mt-4">
                    <h5 className="fw-bold mb-2">Overview:</h5>
                    <p className="text-light">{movie.overview || 'No overview available.'}</p>
                    </div>

                    <div className="mt-4 d-flex flex-column flex-sm-row gap-3">
                    <button className="addwatchlist btn btn-warning fw-bold w-100 w-sm-auto" onClick={handleAddToWatchlist}>
                        + Add to Watchlist
                    </button>
                    <button className="stream btn btn-primary fw-bold w-100 w-sm-auto" onClick={handleStream}>
                         Stream
                    </button>
                    </div>
                </div>
                </div>
            </div>
            )}

      </div>

      <Footer />
    </>
  );
};

export default MovieDetails;
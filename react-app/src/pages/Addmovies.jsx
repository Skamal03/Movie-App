import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideMenu from '../components/SideMenu';
import '../style/addmovies.css';

const AddMovies = () => {
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      alert('Admin Access Only');
      window.location.href = '/';
      return;
    }
    const user = JSON.parse(userData);
    if (!user.isAdmin) {
      alert('Access denied: Admins only');
      window.location.href = '/';
    }

    const form = document.getElementById('addMovieForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
          alert('Not authenticated');
          window.location.href = '/';
          return;
        }

        const formData = new FormData(form);
        const movieData = {
          tmdb_id: parseInt(formData.get('tmdb_id')),
          releaseDate: formData.get('releaseDate'),
          video_url: formData.get('videoUrl'),
        };

        try {
          const response = await fetch('http://localhost:8080/stream/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(movieData),
          });

          const result = await response.json();

          if (response.ok) {
            alert('Movie added!');
            form.reset();
          } else {
            alert('Failed: ' + (result.message || result.error || 'Unknown error'));
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Error adding movie');
        }
      });
    }
  }, []);

  return (
    <>
      <Header />
      <SideMenu />

      <div className="add-movie-top d-flex justify-content-between align-items-center m-4">
        <h1 className="fs-1 fw-bold">ADD MOVIE</h1>
        <a href="/" className="back-btn btn btn-danger fw-bold text-white">
          ← Home
        </a>
      </div>
        
      <form className="add-movie-form" id="addMovieForm">
        <input type="number" name="tmdb_id" placeholder="TMDB ID" required />
        <input type="text" name="releaseDate" placeholder="Release Date (optional)" />
        <input type="text" name="videoUrl" placeholder="Video URL" required />
        <button type="submit">Add Movie</button>
      </form>

      <Footer />
    </>
  );
};

export default AddMovies;

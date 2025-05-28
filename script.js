// side Menu
const browseBtn = document.getElementById('browseBtn');
const sideMenu = document.getElementById('sideMenu');

browseBtn.addEventListener('click', () => {
  sideMenu.classList.toggle('open');
});

function closeSideMenu() {
  sideMenu.classList.remove('open');
}

function toggleSubMenu(id) {
  const submenu = document.getElementById(id);
  submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
}

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = 'http://localhost:8080';

  // Configuration for different pages
  const pageConfig = {
    'index.html': {
      container: '.movies',
      endpoint: '/movies/top-rated',
      hasLoadMore: false
    },
    'action.html': {
      container: '.action',
      endpoint: '/movies/discover/action',
      hasLoadMore: true
    },
    'adventure.html': {
      container: '.adventure',
      endpoint: '/movies/discover/adventure',
      hasLoadMore: true
    },
    'Comedy.html': {
      container: '.comedy',
      endpoint: '/movies/discover/comedy',
      hasLoadMore: true
    },
    'War.html': {
      container: '.war',
      endpoint: '/movies/discover/war',
    },
    'Drama.html': {
      container: '.drama',
      endpoint: '/movies/discover/drama',
      hasLoadMore: true
    },
    'Horror.html': {
      container: '.horror',
      endpoint: '/movies/discover/horror',
      hasLoadMore: true
    },
    'Movies.html': {
      container: '.movies',
      endpoint: '/movies/top-rated',
      hasLoadMore: true
    },
    'tvshows.html': {
      container: '.tv-shows',
      endpoint: '/tv/top-rated',
      hasLoadMore: true
    },
    'Alltime.html': {
      container: '.all-time',
      endpoint: '/movies/top-rated',
      hasLoadMore: true
    },
    'ThisYear.html': {
      container: '.year',
      endpoint: '/movies/this-year',
      hasLoadMore: true
    },
    'Trendingtoday.html': {
      container: '.Trending-today',
      endpoint: '/movies/trending/day',
      hasLoadMore: true
    },
    'ThisWeek.html': {
      container: '.week',
      endpoint: '/movies/trending/week',
      hasLoadMore: true
    },
  };

  const currentPath = window.location.pathname.split('/').pop() || '/';
  const config = pageConfig[currentPath];

  if (!config) return;

  const movieContainer = document.querySelector(config.container);
  const loadMoreBtn = config.hasLoadMore ? document.getElementById('loadMoreBtn') : null;
  let currentPage = 1;

  const fetchMovies = async (page = 1) => {
    try {
      const response = await fetch(`${API_BASE_URL}${config.endpoint}?page=${page}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching movies:', error);
      movieContainer.innerHTML = '<p class="text-white">Failed to load movies. Please try again later.</p>';
      return null;
    }
  };

  const displayMovies = (movies) => {
    const fragment = document.createDocumentFragment();

    movies.forEach(movie => {
      if (!movie.poster_path) return;

      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');
      movieCard.innerHTML = `
        <a href="movie-details.html?id=${movie.id}" style="text-decoration: none; color: inherit;">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
               alt="${movie.title}" 
               class="movie-img"
               loading="lazy">
          <h3>${movie.title}</h3>
          <p>Rating: ${movie.vote_average.toFixed(1)}</p>
        </a>
      `;
      fragment.appendChild(movieCard);
    });

    movieContainer.appendChild(fragment);
  };

  const loadMovies = async () => {
    const data = await fetchMovies(currentPage);
    if (data) {
      if (currentPage === 1) movieContainer.innerHTML = '';
      displayMovies(data.results);
    }
  };

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      loadMovies();
    });
  }

  loadMovies();
});

// search bar
function handleSearch(event) {
  event.preventDefault();

  const query = document.getElementById('searchInput').value.trim();
  if (query !== '') {
    window.location.href = `search.html?query=${encodeURIComponent(query)}`;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = 'http://localhost:8080';

  const urlquery = new URLSearchParams(window.location.search);
  const query = urlquery.get('query');

  if (!query) return;

  document.getElementById('searchQuery').textContent = query;

  const searchUrl = `${API_BASE_URL}/movies/search?query=${encodeURIComponent(query)}`;

  fetch(searchUrl)
    .then(response => response.json())
    .then(data => {
      const resultsContainer = document.getElementById('resultsContainer');

      if (!data.results || data.results.length === 0) {
        resultsContainer.innerHTML = '<p class="text-white">No results found.</p>';
        return;
      }

      data.results.forEach(item => {
        if (!item.poster_path) return;

        const title = item.title || item.name || "No Title";
        const type = item.media_type === 'tv' ? 'tv' : 'movie';
        const detailPage = type === 'tv' ? 'tv-details.html' : 'movie-details.html';

        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
          <a href="${detailPage}?id=${item.id}" style="text-decoration: none; color: inherit;">
            <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" 
                 alt="${title}" 
                 style="width: 200px; border-radius: 10px;" 
                 loading="lazy">
            <h5 class="mt-2 text-white text-center">${title}</h5>
          </a>
        `;
        resultsContainer.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Search error:', error);
      document.getElementById('resultsContainer').innerHTML = '<p class="text-white">Error loading results.</p>';
    });
});

// movie details
document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = 'http://localhost:8080';

  const params = new URLSearchParams(window.location.search);
  const movieId = params.get('id');
  const detailsContainer = document.getElementById('movieDetails');

  if (!movieId) {
    detailsContainer.innerHTML = "<p class='text-white'>Movie ID not found in URL.</p>";
    return;
  }

  const detailsUrl = `${API_BASE_URL}/movies/details/${movieId}`;

  fetch(detailsUrl)
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch movie details.");
      return response.json();
    })
    .then(movie => {
      const genres = movie.genres.map(g => g.name).join(', ');
      const companies = movie.production_companies.map(c => c.name).join(', ');
      const language = movie.original_language.toUpperCase();
      const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '';

      detailsContainer.innerHTML = `
        <div class="text-white p-4">
          <h2 class="text-center mb-5 fw-bold">${movie.title}</h2>

          <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-4">
            <!-- Left: Poster -->
            <div class="text-center">
              <img src="${poster}" alt="${movie.title}" style="border-radius: 10px; max-width: 300px;">
              <p class="mt-2 text-warning"><em>${movie.tagline || ''}</em></p>
            </div>

            <div>
              <p><strong>Release Date:</strong> ${movie.release_date}</p>
              <p><strong>Duration:</strong> ${movie.runtime} mins</p>
              <p><strong>Overall Rating:</strong> ${movie.vote_average.toFixed(1)}</p>
              <p><strong>Language:</strong> ${language}</p>
              <p><strong>Genres:</strong> ${genres}</p>
              <p><strong>Production:</strong> ${companies}</p>
              <p><strong>Overview:</strong><br> ${movie.overview}</p>

              <div class="mt-5 d-flex gap-3 mb-5">
                <button class="addwatclist btn btn-warning fw-bold">Add to Watchlist</button>
                <button class="stream btn btn-primary fw-bold" onclick="streamMovie(${movie.id})">Stream</button>
              </div>
            </div>
          </div>
        </div>
      `;

    })
    .catch(error => {
      console.error('Details error:', error);
      detailsContainer.innerHTML = "<p class='text-white'>Error loading movie details.</p>";
    });
});

// straming movies
function streamMovie(tmdb_id) {
  const player = document.createElement('div');
  player.innerHTML = `
    <div class="video-modal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; justify-content:center; align-items:center; z-index:9999;">
      <video id="videoPlayer" controls width="80%" style="outline: none;">
        <source src="http://localhost:8080/stream/${tmdb_id}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <button onclick="this.parentElement.remove()" style="position:absolute; top:20px; right:30px; font-size:25px; color:white; background:none; border:none; cursor:pointer;">&times;</button>
      <button onclick="document.getElementById('videoPlayer').requestFullscreen()" style="position:absolute; bottom:20px; right:30px; font-size:16px; color:white; background:#333; border:none; padding:8px 12px; cursor:pointer;">Fullscreen</button>
    </div>
  `;
  document.body.appendChild(player);
}

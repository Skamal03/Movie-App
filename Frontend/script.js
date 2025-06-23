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

document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = 'http://localhost:8080';

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
      endpoint: '/movies/tv/top-rated',
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
  
      const isTVPage = currentPath === 'tvshows.html';
      const title = movie.title || movie.name;
      const href = isTVPage 
        ? `tv-details.html?id=${movie.id}&type=tv`
        : `movie-details.html?id=${movie.id}&type=movie`;
  
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');
      movieCard.innerHTML = `
        <a href="${href}" style="text-decoration: none; color: inherit;">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
               alt="${title}" 
               class="movie-img"
               loading="lazy">
          <h3>${title}</h3>
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
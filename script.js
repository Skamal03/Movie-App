// For the home page
const apiKey = '447bbae2e176863ed6ad30d6b10ecdd9';

const apiUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;

const movieContainer = document.querySelector('.movies');

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const movies = data.results;
    movieContainer.innerHTML = '';

    movies.forEach(movie => {
      const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');

      movieCard.innerHTML = `
        <img src="${posterUrl}" alt="${movie.title}">
        <h3>${movie.title}</h3>
      `;

      movieContainer.appendChild(movieCard);
    });
  })
  .catch(error => {
    console.error('Error fetching movies:', error);
    movieContainer.innerHTML = '<p>Failed to load movies.</p>';
  });

  // side Menue
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

// search bar

function handleSearch(event) {
  event.preventDefault();

  const query = document.getElementById('searchInput').value.trim();
  if (query !== '') {
    window.location.href = `search.html?query=${encodeURIComponent(query)}`;
  }
}


// Const
const apiKey = "ca72980f5cff3e429d5774c01c3af63d";
const apiEndpoint = "https://api.themoviedb.org/3";
const imagePath = "https:/image.tmdb.org/t/p/original";

const apiPath = {
  fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apiKey}`,
  fetchMoviesList: (id) =>
    `${apiEndpoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
  fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apiKey}&language=en-US`,
};

function init() {
  fetchTrendingMovies();
  fetchAndBuildAllSections();
}

function fetchTrendingMovies() {
  fetchAndBuildMovieSections(apiPath.fetchTrending, "Trending Now")
    .then((list) => {
      // console.log(list);
      const randomIndex = parseInt(Math.random() * list.length);
      buildBannerSection(list[randomIndex]);
    })
    .catch((err) => {
      console.error(err);
    });
}

function buildBannerSection(movies) {
  console.log(movies);
  const bannerSection = document.getElementById("banner-section");
  bannerSection.style.backgroundImage = `url('${imagePath}${movies.backdrop_path}')`;

  const div = document.createElement("div");
  div.className = "banner-container container";
  div.innerHTML = `
  <h2 class="banner-title">${movies.title}</h2>
  <p class="banner-info">#4 in TV Shows Today</p>
  <p class="banner-overview">${
    movies.overview && movies.overview.length > 200
      ? movies.overview.slice(0, 200).trim() + "..."
      : movies.overview
  }</p>
  <div class="action-buttons-container">
  <button class="action-buttons">Play</button>
  <button class="action-buttons">More Info</button>
  </div>
  `;
  bannerSection.append(div);
}

function fetchAndBuildAllSections() {
  fetch(apiPath.fetchAllCategories)
    .then((res) => res.json())
    .then((res) => {
      const categories = res.genres;
      if (Array.isArray(categories) && categories.length) {
        categories.forEach((category) => {
          fetchAndBuildMovieSections(
            apiPath.fetchMoviesList(category.id),
            category.name
          );
        });
      }
      // console.table(categories);
    })
    .catch((err) => console.log(err));
}

function fetchAndBuildMovieSections(fetchUrl, categoryName) {
  // console.log(fetchUrl, categoryName);
  return fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => {
      // console.log(res.results);
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMoviesSection(movies, categoryName);
      }
      return movies;
    })
    .catch((err) => console.log(err));
}

function buildMoviesSection(list, categoryName) {
  // console.log(list, categoryName);

  const movieContainer = document.getElementById("movie-container");

  const moviesListHTML = list
    .map((item) => {
      return `
    <img src="${imagePath}${item.backdrop_path}" alt='${item.title}' class="movie-item">
    `;
    })
    .join("");

  // console.log(moviesListHTML);

  const moviesSectionHTML = `
            <h2 class="movie-section-heading">${categoryName} <span class="explore-nudge">Explore All >></span></h2>
             <div class="movies-row">
                ${moviesListHTML}
             </div>
  `;
  const div = document.createElement("div");
  div.className = "movies-section";
  div.innerHTML = moviesSectionHTML;
  movieContainer.append(div);
}

window.addEventListener("load", function () {
  init();
  window.addEventListener("scroll", function () {
    // Header UI update
    const header = document.getElementById("header");
    if (window.scrollY > 5) header.classList.add("blackBg");
    else header.classList.remove("blackBg");
  });
});

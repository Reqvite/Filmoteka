import { fetchGenreId } from './collectionFetch';
import { fetchPopularMovies } from './collectionFetch';
import { renderMarkUp } from '../markups/collectionRender';
import updateMarkupPagination from '../componets/pagination';
import { refs } from '../refs/refs';

export { fetchTrendingFilms };

// let page = 1;
let genreCollection = {};
localStorage.setItem('currentPage', '1');

async function fetchTrendingFilms() {
  let currentPage = Number(localStorage.getItem('currentPage')) || 1;
  const resp = await fetchGenreId();

  resp.data.genres.forEach(function (genre) {
    genreCollection[genre.id] = genre.name;
  });

  await fetchMovies(currentPage);
}

function fetchMovies(page) {
  fetchPopularMovies(page).then(response => {
    const render = renderMarkUp(response.data.results, genreCollection);

    refs.collection.innerHTML = render;
    updateMarkupPagination(
      response.data.total_pages,
      page,
      fetchMoviesOnPagination
    );
  });
}

function fetchMoviesOnPagination(page) {
  fetchPopularMovies(page).then(response => {
    const render = renderMarkUp(response.data.results, genreCollection);
    refs.collection.innerHTML = render;
    setTimeout(() => {
      document
        .querySelector('.container-films')
        .scrollIntoView({ behavior: 'smooth' });
    }, 100);
  });
}

fetchTrendingFilms();

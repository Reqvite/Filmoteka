import { fetchGenreId } from './collectionFetch';
import { fetchPopularMovies } from './collectionFetch';
import { renderMarkUp } from './markups/collectionRender';
import updateMarkupPagination from './pagination';
import { refs } from './refs/refs';

export { fetchTrendingFilms };

let page = 1;
const collection = document.querySelector(`.container-films`);
const pagination = document.querySelector(`.pagination`);

let genreCollection = {};

async function fetchTrendingFilms() {
  const resp = await fetchGenreId();

  resp.data.genres.forEach(function (genre) {
    genreCollection[genre.id] = genre.name;
  });

  await fetchMovies(page);
}

function fetchMovies(page) {
  fetchPopularMovies(page).then(response => {
    const render = renderMarkUp(response.data.results, genreCollection);
    // const renderedPagination = renderPagination(Number(response.data.page), Number(response.data.total_pages))
    collection.innerHTML = render;
    // pagination.innerHTML = renderedPagination;

    updateMarkupPagination(
      response.data.total_pages,
      page,
      fetchMoviesOnPagination
    );
  });
}

function fetchMoviesOnPagination(page) {
  document.querySelector('.header').scrollIntoView();
  fetchPopularMovies(page).then(response => {
    const render = renderMarkUp(response.data.results, genreCollection);
    collection.innerHTML = render;
  });
}

fetchTrendingFilms();

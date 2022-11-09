import { fetchGenreId } from './collectionFetch';
import { fetchPopularMovies } from './collectionFetch';
import { renderMarkUp } from './markups/collectionRender';
import updateMarkupPagination from './pagination';
import { refs } from './refs/refs';

export { fetchTrendingFilms };

let page = 1;
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
    refs.collection.innerHTML = render;

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
    refs.collection.innerHTML = render;
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
  });
}

fetchTrendingFilms();

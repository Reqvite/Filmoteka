import FilmsApiServer from './fimlsApiServer';
import Notiflix from 'notiflix';
import updateMarkupPagination from './pagination';
import { fetchGenreId } from './collectionFetch';
import { renderMarkUp } from './markups/collectionRender';
import { refs } from './refs/refs';
import { spinner } from './spinner';

const filmsApiServer = new FilmsApiServer();
const todayDate = new Date();
const currYear = todayDate.getFullYear();

let genreCollection = {};
fetchGenreId()
  .then(genreId => {
    genreId.data.genres.forEach(function (genre) {
      genreCollection[genre.id] = genre.name;
    });
  })
  .catch(error => console.log(error));

refs.form.addEventListener('submit', onSubmitForm);

function onSubmitForm(e) {
  e.preventDefault();
  clearContainer(refs.gallery);
  clearContainer(refs.listEl);
  filmsApiServer.resetPage();

  filmsApiServer.query = e.currentTarget.searchFilm.value.trim();
  const userYearString = e.currentTarget.searchYear.value.trim();

  if (userYearString) {
    const userYear = Number(userYearString);
    if (userYear < 1895 || currYear <= userYear || Number.isNaN(userYear)) {
      Notiflix.Notify.info('Please, enter correct year!');
      clearSearchYear();
      return;
    }
  }

  filmsApiServer.primary_release_year = Number(userYearString);

  if (filmsApiServer.query === '') {
    Notiflix.Notify.warning('Please enter your search query');
    return;
  }

  addFilmsAndUpdateUI();
}

async function addFilmsAndUpdateUI() {
  let results;
  try {
    spinner();
    if (!filmsApiServer.primary_release_year) {
      results = await filmsApiServer.fetchFilms();
    } else {
      results = await filmsApiServer.fetchFilmsYear();
    }
    spinner();
    renderGalleryList(results);
  } catch (err) {
    onFetchError(err);
  }
}

async function renderAfterChangingPage(currentPage) {
  try {
    filmsApiServer.pagePagination = currentPage;
    spinner();

    const data = await filmsApiServer.fetchFilms();
    const { results, page, total_pages } = data;
    const render = renderMarkUp(results, genreCollection);

    refs.gallery.innerHTML = render;
    spinner();
    setTimeout(() => {
      document
        .querySelector('.container-films')
        .scrollIntoView({ behavior: 'smooth' });
    }, 500);
  } catch (err) {
    onFetchError(err);
  }
}

function renderGalleryList(data) {
  const { results, page, total_pages } = data;
  clearSearchQuery();
  clearSearchYear();

  if (results.length === 0) {
    clearContainer(refs.listEl);
    Notiflix.Notify.failure(
      'Search result not successful. Enter the correct movie name and try again'
    );
    return;
  }

  spinner();
  const render = renderMarkUp(results, genreCollection);
  refs.gallery.innerHTML = render;
  spinner();

  updateMarkupPagination(total_pages, page, renderAfterChangingPage);
}

function clearSearchQuery() {
  refs.form.searchFilm.value = '';
}

function clearSearchYear() {
  refs.form.searchYear.value = '';
}

function clearContainer(element) {
  element.innerHTML = '';
}

function onFetchError(err) {
  console.log(err);
  clearContainer(refs.gallery);
}

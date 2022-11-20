import FilmsApiServer from './fimlsApiServer';
import Notiflix from 'notiflix';
import updateMarkupPagination from '../componets/pagination';
import { fetchGenreId } from './collectionFetch';
import { renderMarkUp } from '../markups/collectionRender';
import { refs } from '../refs/refs';
import { spinner } from '../componets/spinner';
import renderSubFilterMarkup from '../markups/renderSubFilterMarkup';
import * as image from '../../images/searchError.jpg';
import { async } from '@firebase/util';

const filmsApiServer = new FilmsApiServer();

let genreCollection = {};
fetchGenreId()
  .then(genreId => {
    genreId.data.genres.forEach(function (genre) {
      genreCollection[genre.id] = genre.name;
    });
  })
  .catch(error => console.log(error));

refs.form.addEventListener('submit', onSubmitForm);
refs.filterButtons.addEventListener('click', onClickFilterButtons);

function onSubmitForm(e) {
  e.preventDefault();
  clearContainer(refs.gallery);
  clearContainer(refs.listEl);
  filmsApiServer.resetPage();
  filmsApiServer.resetGenreId();

  filmsApiServer.query = e.currentTarget.search.value.trim();

  if (filmsApiServer.query === '') {
    Notiflix.Notify.warning('Please enter your search query', {
      timeout: 1000,
    });
    return;
  }

  addFilmsAndUpdateUI();
}

function onClickFilterButtons(e) {
  if (e.target.name === 'genre') {
    if (!document.querySelector('.sub-filter__item')) {
      const markup = renderSubFilterMarkup(Object.values(genreCollection));
      refs.genreButton.nextElementSibling.insertAdjacentHTML(
        'beforeend',
        markup
      );
      refs.genreButton.style.color = '#ff6b08';
      const subFilterButtons = document.querySelector('.sub-filter--genre');
      subFilterButtons.addEventListener('click', onClickSubFilterButton);
      async function onClickSubFilterButton(e) {
        // if (event.target.nodeName !== 'BUTTON') {
        //   refs.genreButton.style.color = '#000000';
        //   clearContainer(refs.genreButton.nextElementSibling);
        //   return;
        // }
        const userGenre = e.target.innerText;
        const numberGenre = Object.values(genreCollection).indexOf(userGenre);
        const userGenreId = Object.keys(genreCollection)[numberGenre];
        refs.genreButton.style.color = '#000000';
        clearContainer(refs.genreButton.nextElementSibling);
        filmsApiServer.genreId = userGenreId;
        filmsApiServer.resetPage();
        clearContainer(refs.gallery);
        clearContainer(refs.listEl);
        addFilmsAndUpdateUI();
      }
      return;
    } else {
      refs.genreButton.style.color = '#000000';
      clearContainer(refs.genreButton.nextElementSibling);
      return;
    }
  }

  if (e.target.name === 'sort') {
  }

  if (e.target.name === 'year') {
    console.log(e.target.name);
  }
}

async function addFilmsAndUpdateUI() {
  try {
    let results;
    spinner();
    if (filmsApiServer.genreId) {
      results = await filmsApiServer.fetchFimsId();
    } else {
      results = await filmsApiServer.fetchFilms();
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
    let data;
    spinner();
    if (filmsApiServer.genreId) {
      data = await filmsApiServer.fetchFimsId();
    } else {
      data = await filmsApiServer.fetchFilms();
    }
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

  if (results.length === 0) {
    clearContainer(refs.listEl);
    Notiflix.Notify.failure(
      'Search result not successful. Enter the correct movie name and try again',
      {
        timeout: 2000,
      }
    );
    const title = `
  <img
  src="${image}"
  alt="foto"
  width="1000px" height="1000px"
/>
  `;
    refs.gallery.innerHTML = title;
    return;
  }

  spinner();
  const render = renderMarkUp(results, genreCollection);
  refs.gallery.innerHTML = render;
  spinner();

  updateMarkupPagination(total_pages, page, renderAfterChangingPage);
}

function clearSearchQuery() {
  refs.form.search.value = '';
}

function clearContainer(element) {
  element.innerHTML = '';
}

function onFetchError(err) {
  console.log(err);
  clearContainer(refs.gallery);
}

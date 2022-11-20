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
  filmsApiServer.activeSearch = '';
  filmsApiServer.genreId = '';
  filmsApiServer.sortVariety = '';
  localStorage.setItem('currentPage', '1');

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
  filmsApiServer.activeSearch = e.target.name;
  if (filmsApiServer.activeSearch === 'genre') {
    filmsApiServer.sortVariety = '';
    filmsApiServer.primary_release_year = '';
    const currentFilterButton = refs.genreButton;
    const objSubFilterDataKeys = Object.keys(genreCollection);
    const objSubFilterDataValues = Object.values(genreCollection);
    createSubFilterMarkup(
      currentFilterButton,
      objSubFilterDataKeys,
      objSubFilterDataValues
    );
  }

  if (filmsApiServer.activeSearch === 'sort') {
    filmsApiServer.genreId = '';
    filmsApiServer.primary_release_year = '';
    const currentFilterButton = refs.sortButton;
    const objSubFilterDataKeys = [
      'popularity.desc',
      'popularity.asc',
      'release_date.desc',
      'release_date.desc',
      'original_tile.desc',
      'original_tile.asc',
    ];
    const objSubFilterDataValues = [
      'Popularity (decreasing)',
      'Popularity (increasing)',
      'Release date (decreasing)',
      'Release date (increasing)',
      'A-Z',
      'Z-A',
    ];

    createSubFilterMarkup(
      currentFilterButton,
      objSubFilterDataKeys,
      objSubFilterDataValues
    );
  }

  if (filmsApiServer.activeSearch === 'year') {
    filmsApiServer.genreId = '';
    filmsApiServer.sortVariety = '';
    const currentFilterButton = refs.yearButton;
    const today = new Date();
    const currentYear = today.getFullYear();
    const objSubFilterDataValues = [];
    const objSubFilterDataKeys = [];
    for (let i = 1874; i <= currentYear; i += 1) {
      objSubFilterDataKeys.push(i);
      objSubFilterDataValues.push('' + i);
    }
    createSubFilterMarkup(
      currentFilterButton,
      objSubFilterDataKeys,
      objSubFilterDataValues
    );
  }
}

async function addFilmsAndUpdateUI() {
  try {
    let results;
    spinner();
    switch (filmsApiServer.activeSearch) {
      case 'genre':
        results = await filmsApiServer.fetchFimsId();
        break;
      case 'sort':
        results = await filmsApiServer.fetchFimsSorting();
        break;
      case 'year':
        results = await filmsApiServer.fetchFilmsYear();
        break;
      default:
        results = await filmsApiServer.fetchFilms();
        break;
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
    } else if (filmsApiServer.sortVariety) {
      data = await filmsApiServer.fetchFimsSorting();
    } else if (filmsApiServer.primary_release_year) {
      data = await filmsApiServer.fetchFilmsYear();
    }
    {
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
  return;
}

function createSubFilterMarkup(filterButton, dataKeys, dataValues) {
  if (!document.querySelector('.sub-filter__item')) {
    const subFilterContainer = filterButton.nextElementSibling;
    const markup = renderSubFilterMarkup(dataValues);
    subFilterContainer.insertAdjacentHTML('beforeend', markup);
    filterButton.style.color = '#ff6b08';
    subFilterContainer.addEventListener('click', onClickSubFilterButton);
    async function onClickSubFilterButton(e) {
      if (e.target.nodeName !== 'BUTTON') {
        filterButton.style.color = '#000000';
        clearContainer(filterButton.nextElementSibling);
        return;
      }
      localStorage.setItem('currentPage', '1');
      const userSelectedItem = e.target.innerText;
      const numberItem = dataValues.indexOf(userSelectedItem);
      const dataSearch = dataKeys[numberItem];
      filterButton.style.color = '#000000';
      clearContainer(filterButton.nextElementSibling);
      switch (filmsApiServer.activeSearch) {
        case 'genre':
          filmsApiServer.genreId = dataSearch;
          break;
        case 'sort':
          filmsApiServer.sortVariety = dataSearch;
          break;
        case 'year':
          filmsApiServer.primary_release_year = dataSearch;
          break;
      }
      filmsApiServer.resetPage();
      clearContainer(refs.gallery);
      clearContainer(refs.listEl);
      addFilmsAndUpdateUI();
    }
    return;
  } else {
    filterButton.style.color = '#000000';
    clearContainer(filterButton.nextElementSibling);
    return;
  }
}

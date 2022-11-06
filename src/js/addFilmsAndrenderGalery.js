import FilmsApiServer from './fimlsApiServer';
import Notiflix from 'notiflix';
import filmCardsTpl from './markups/filmCardMarkup' 
import updateMarkupPagination from './pagination'
import { refs } from "./refs/refs";

const filmsApiServer = new FilmsApiServer();

refs.form.addEventListener('submit', onSubmitForm);

function onSubmitForm(e) {
  e.preventDefault();
  clearContainer(refs.gallery);
  clearContainer(refs.listEl);
  
  filmsApiServer.query = e.currentTarget.search.value.trim();

  if (filmsApiServer.query === '') {
    Notiflix.Notify.warning('Please enter your search query');
    
    return;
  }

  localStorage.setItem('query', `${filmsApiServer.query}`);
  addFilmsAndUpdateUI();
}


async function addFilmsAndUpdateUI() {
  try {
    refs.spinner.classList.remove('is-hiden');
    const results = await filmsApiServer.fetchFilms();
    refs.spinner.classList.add('is-hiden');
    renderGalleryList(results);
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
      'Search result not successful. Enter the correct movie name and try again'
    );
    
    return;
  }
  refs.gallery.innerHTML = filmCardsTpl(results); //filmCardsTpl(data) - функція яка рендерить HTML сторінку(робить хтось інший), results - масив обєктів
  updateMarkupPagination(total_pages, page);
}

function clearSearchQuery() {
  refs.form.search.value = '';
}

function clearContainer(element) {
  element.innerHTML = '';
}

function onFetchError(err) {
  console.log(err);
  clearGalleryContainer();
}


import FilmsApiServer from './fimlsApiServer';
import Notiflix from 'notiflix';
import filmCardsTpl from './markups/filmCardMarkup' 
import updateMarkupPagination from './pagination'

const filmsApiServer = new FilmsApiServer();

const refs = {
  form: document.querySelector('.header__search-form'),
  gallery: document.querySelector('.container-films'), // .container-films - контейнер для карток в main(робить хтось інший)
  listEl: document.querySelector('.pagination__list'),
};

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
    const results = await filmsApiServer.fetchFilms();
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


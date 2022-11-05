import FilmsApiServer from './fimlsApiServer';
import Notiflix from 'notiflix';
import filmCardsTpl from './markups/filmCardMarkup' 

const filmsApiServer = new FilmsApiServer();

const refs = {
  form: document.querySelector('.header__search-form'),
  gallery: document.querySelector('.container-films'), // .container-films - контейнер для карток в main(робить хтось інший)
  spinner: document.querySelector('.loader'),
};

refs.form.addEventListener('submit', onSubmitForm);

function onSubmitForm(e) {
  e.preventDefault();
  clearGalleryContainer();

  filmsApiServer.query = e.currentTarget.search.value.trim();

  if (filmsApiServer.query === '') {
    Notiflix.Notify.warning('Please enter your search query');
    return;
  }

  addFilmsAndUpdateUI();
}


async function addFilmsAndUpdateUI() {
  try {
    const { results } = await filmsApiServer.fetchFilms();
    renderGalleryList(results);
  } catch (err) {
    onFetchError(err);
  }
}

function renderGalleryList(data) {
  
  if (data.length === 0) {
    Notiflix.Notify.failure(
      'Search result not successful. Enter the correct movie name and try again'
    );
    clearSearchQuery();
    return;
  }
  refs.spinner.classList.remove('is-hiden');
  refs.gallery.insertAdjacentHTML('beforeend', filmCardsTpl(data)); //filmCardsTpl(data) - функція яка рендерить HTML сторінку(робить хтось інший), data - масив обєктів
  refs.spinner.classList.add('is-hiden');
}

function clearSearchQuery() {
  refs.form.search.value = '';
}

function clearGalleryContainer() {
  refs.gallery.innerHTML = '';
}

function onFetchError(err) {
  console.log(err);
  clearGalleryContainer();
}


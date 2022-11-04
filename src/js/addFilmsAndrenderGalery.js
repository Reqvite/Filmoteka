import FilmsApiServer from './fimlsApiServer';

const filmsApiServer = new FilmsApiServer();
const refs = {
  form: document.querySelector('.search-form'), // .search-form - селектор форми в якій знаїодиться інпут - поле пошуку
  gallery: document.querySelector('.gallery'), // .gallery- селектор контейнема в який буде рендеритися дані з бекенду
};

refs.form.addEventListener('submit', onSubmitForm);

function onSubmitForm(e) {
  e.preventDefault();
  clearGalleryContainer();
  filmsApiServer.resetPage();

  filmsApiServer.query = e.currentTarget.searchQuery.value.trim();

  if (filmsApiServer.query === '') {
    Notiflix.Notify.warning(
      'Please enter your search query'
    );

    return;
  }

  addFilmsAndUpdateUI();
}

async function addFilmsAndUpdateUI() {
  try {
	const { results } = await filmsApiServer.fetchFilms();
    renderGalleryList(results);
    // filmsApiServer.increasePage();

  } catch (err) {
    onFetchError(err);
  }
}

function renderGalleryList(data) {

  if (data.length === 0) {
    Notiflix.Notify.failure(
      'Search result not successful. Enter the correct movie name and try again'
    );
    clearGalleryContainer();
    return;
  }

  refs.gallery.insertAdjacentHTML('beforeend', fotoCardsTpl(data)); //fotoCardsTpl(data) - функція яка рендерить HTML сторінку, data - масив обєктів
}

function clearGalleryContainer() {
  refs.gallery.innerHTML = '';
}

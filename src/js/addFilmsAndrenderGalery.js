import FilmsApiServer from './fimlsApiServer';
import Notiflix from 'notiflix';
import updateMarkupPagination from './pagination'
import { fetchGenreId } from './collectionFetch'; 
import { renderMarkUp } from './markups/collectionRender'; 
import { refs } from "./refs/refs";

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

function onSubmitForm(e) {
  e.preventDefault();
  clearContainer(refs.gallery);
  clearContainer(refs.listEl);
  filmsApiServer.resetPage();
  
  filmsApiServer.query = e.currentTarget.search.value.trim();

  if (filmsApiServer.query === '') {
    Notiflix.Notify.warning('Please enter your search query');
    return;
  }

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

async function renderAfterChangingPage(currentPage) {
  try {
    document.querySelector('.header').scrollIntoView();
    filmsApiServer.pagePagination = currentPage;
    const data = await filmsApiServer.fetchFilms();
    const { results, page, total_pages } = data;

    refs.spinner.classList.remove('is-hiden');
    const render = renderMarkUp(results, genreCollection);
    refs.gallery.innerHTML = render; 
    refs.spinner.classList.add('is-hiden');
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

  
  refs.spinner.classList.remove('is-hiden');
  const render = renderMarkUp(results, genreCollection);
  refs.gallery.innerHTML = render;
    refs.spinner.classList.add('is-hiden');

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


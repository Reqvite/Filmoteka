import FilmsApiServer from './fimlsApiServer';
import Notiflix from 'notiflix';
import updateMarkupPagination from '../componets/pagination';
import { fetchGenreId } from './collectionFetch'; 
import { renderMarkUp } from '../markups/collectionRender'; 
import { refs } from "../refs/refs";
import { spinner } from "../componets/spinner";

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
    Notiflix.Notify.warning('Please enter your search query', {
      timeout: 1000,
    });
    return;
  }

  addFilmsAndUpdateUI();
}


async function addFilmsAndUpdateUI() {
  try {
    spinner();
    const results = await filmsApiServer.fetchFilms();
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
    document.querySelector('.container-films').scrollIntoView({behavior: "smooth"});
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
      'Search result not successful. Enter the correct movie name and try again', {
      timeout: 1000,
    });
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
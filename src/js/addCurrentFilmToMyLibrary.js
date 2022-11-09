import Notiflix from 'notiflix';
import {
  renderMurkUpLibrary,
  clearContainer,
} from './markups/renderMarkUpLibrary';
import { fetchTrendingFilms } from './collection.js';
import { spinner } from "./spinner";

const libraryButton = document.querySelector('.header__mylibrary');
const homeButton = document.querySelector('.home-js');
const container = document.querySelector('.container-films');
const watchedButton = document.querySelector('.watched-js');
const queueButton = document.querySelector('.queue-js');

let dataWatched = [];

export function onClickAddToWached(data, evt) {
  const watchedMovieInLS = JSON.parse(localStorage.getItem('watched'));

  if (evt.target.name !== 'watched') {
    return;
  }

  if (dataWatched.some(el => el.id === data.id)) {
    Notiflix.Notify.info(`Тhis movie has already been added to the watched.`);
    return;
  }

  if (watchedMovieInLS !== null) {
    const checkingListWatchedArr = watchedMovieInLS.some(
      el => el.id === data.id
    );

    if (checkingListWatchedArr) {
      Notiflix.Notify.info(
        `Тhis movie has already been added to the watched list.`
      );
      return;
    } else {
      watchedMovieInLS.push(data);
      localStorage.setItem('watched', JSON.stringify(watchedMovieInLS));
      Notiflix.Notify.success(`Add movie to watched list.`);
    }
    return;
  }

  dataWatched.push(data);
  localStorage.setItem('watched', JSON.stringify(dataWatched));

  Notiflix.Notify.success(`Add movie to watched list.`);
}

// Клік на кнопку вочед і рендер розмітки

function onWatchedClick(e) {
  spinner();
  const watchedMovieInLS = JSON.parse(localStorage.getItem('watched'));
  if (e.target.name == 'watched-btn') {
   
    if (watchedMovieInLS === '') {
      Notiflix.Notify.failure(`My library is emty`);
      return;
    }

    // вирішити де буде стан актів по дефолту

    queueButton.classList.remove('header__mylibrary-btn--active');
    watchedButton.classList.add('header__mylibrary-btn--active');

    const markupWatched = renderMurkUpLibrary(watchedMovieInLS);

    clearContainer();
   
    container.innerHTML = markupWatched;
    
  }
  spinner();
}

function onHomeClick() {
  clearContainer();
  fetchTrendingFilms();
}

homeButton.addEventListener('click', onHomeClick);
libraryButton.addEventListener('click', onWatchedClick);

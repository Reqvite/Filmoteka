import img from '../../images/collection/csaff-no-poster.jpg';
import viewTrailer from '../viewTrailer';
import Notiflix from 'notiflix';

import {
  onClickBtnToQueue,
  checkDataMovie,
  onRemoveQueueBtnClick,
} from '../myLibrary';
import { onClickAddToWatched } from '../addFilmToWatchedList-firebase';
import {
  ChangeColorText,
  closeModal,
  closeModalOutsideWindow,
  escModal,
} from '../openFilmModal';

const modal = document.querySelector('.film-modal-content');
const containerModal = document.querySelector('.backdrop-details');
const modalClose = document.querySelector('.modal-icon-cross');

export const createFilmDetailsMarkup = (resp, isAdded, isAddedToWatched) => {
  let {
    poster_path,
    original_title,
    vote_average,
    vote_count,
    popularity,
    genres,
    overview,
    id,
  } = resp.data;

  let rating = null;

  poster_path
    ? (poster_path = `https://www.themoviedb.org/t/p/w500/${poster_path}`)
    : (poster_path = img);
  vote_average
    ? (vote_average = vote_average.toFixed(1))
    : (vote_average = '?');

  //-----підставляє техт і клас в кнопку queue-------

  // const addToQueueBnt = isAdded ? 'REMOVE FROM QUEUE' : 'ADD TO QUEUE';
  // const classQueueBtn = isAdded ? 'remove-from-queue' : 'queue-add';

  if (vote_average >= 7) {
    rating = 'masterpiece';
  } else if (vote_average >= 5 && vote_average <= 7) {
    rating = 'good';
  } else if (vote_average <= 5) {
    rating = 'bad';
  }

  const markup = `<div class="film-details-wrapper">
	<div>
		<div class="thumb">
			<img class="modal-img" src="${poster_path}" alt="${original_title}" data-id="${id}" />
			<button class="trailer-button trailer-button--view button" type="button">
				<span class="trailer-button__text trailer-button__text--play"></span>
			</button>
		</div>
	</div>
	<div class="film-details">
		<h2 class="film-details__main-title">${original_title}</h2>
		<ul class="details-list list">
			<li class="details-list__item">
				<p class="details-list_title">Vote / Votes</p>
				<span class="details-list__information-1 ${rating}">${vote_average}</span>&nbsp/&nbsp<span
					class="details-list__information-2">${vote_count}</span>
			</li>
			<li class="details-list__item">
				<p class="details-list_title">Popularity</p>
				<span class="details-list__information-2">${popularity}</span>
			</li>
			<li class="details-list__item">
				<p class="details-list_title">Original Title</p>
				<span class="details-list__information-2 ">${original_title}</span>
			</li>
			<li class="details-list__item">
				<p class="details-list_title">Genre</p>
				<span class="details-list__information-2">${genres.map(el => {
          return el.name;
        })}</span>
			</li>
		</ul>
		<h3 class="film-details__secondary-title">About</h3>
		<p class="film-details__about">${overview}</p>
		<ul class="buttons-list list">
			<li class="buttons-list__item">
				<button class="main-button watched-add button" type="button" name="watched">Add to watched</button>
			</li>
			<li class="buttons-list__item"><button class="secondary-button remove-from-queue button"  type="button" name="queue">REMOVE FROM QUEUE</button></li>
			<li class="buttons-list__item"><button class="secondary-button queue-add button" type="button" name="queue">ADD TO QUEUE</button></li>
			
			
		</ul>
		<div class="trailer"></div>
		<button class="trailer-button trailer-button--close button is-hidden" type="button">
				<span class="trailer-button__text trailer-button__text--stop"></span>
			</button>
	</div>
</div>`;

  modal.insertAdjacentHTML('beforeend', markup);

  openModal();
  const queueAddBtn = document.querySelector('.queue-add');
  const removeFromQueueBtn = document.querySelector('.remove-from-queue');

  const watchedAddBtn = document.querySelector('.watched-add');

  isAdded
    ? queueAddBtn.classList.add('hidden')
    : removeFromQueueBtn.classList.add('hidden');

  isAddedToWatched
    ? (watchedAddBtn.textContent = 'remove from watched')
    : (watchedAddBtn.textContent = 'add to watched');

  // if (isAdded) {
  // 	queueAddBtn.classList.add('hidden')
  // 	removeFromQueueBtn.classList.remove('hidden')
  // } else {
  // 	removeFromQueueBtn.classList.add('hidden')
  // 	queueAddBtn.classList.remove('hidden')
  // }

  queueAddBtn?.addEventListener('click', e => onClickBtnToQueue(resp.data, e));
  removeFromQueueBtn?.addEventListener('click', e =>
    onRemoveQueueBtnClick(resp.data, e)
  );

  viewTrailer(id);

  watchedAddBtn.addEventListener('click', e =>
    onClickAddToWatched(resp.data, isAddedToWatched)
  );
};

//--------------------render if no user--------------

export const createFilmDetailsMarkupNoUser = resp => {
  let {
    poster_path,
    original_title,
    vote_average,
    vote_count,
    popularity,
    genres,
    overview,
    id,
  } = resp.data;

  let rating = null;

  poster_path
    ? (poster_path = `https://www.themoviedb.org/t/p/w500/${poster_path}`)
    : (poster_path = img);
  vote_average
    ? (vote_average = vote_average.toFixed(1))
    : (vote_average = '?');

  if (vote_average >= 7) {
    rating = 'masterpiece';
  } else if (vote_average >= 5 && vote_average <= 7) {
    rating = 'good';
  } else if (vote_average <= 5) {
    rating = 'bad';
  }

  const markup = `<div class="film-details-wrapper">
	  <div>
		  <div class="thumb">
			  <img class="modal-img" src="${poster_path}" alt="${original_title}" data-id="${id}" />
			  <button class="trailer-button trailer-button--view button" type="button">
				  <span class="trailer-button__text trailer-button__text--play"></span>
			  </button>
		  </div>
	  </div>
	  <div class="film-details">
		  <h2 class="film-details__main-title">${original_title}</h2>
		  <ul class="details-list list">
			  <li class="details-list__item">
				  <p class="details-list_title">Vote / Votes</p>
				  <span class="details-list__information-1 ${rating}">${vote_average}</span>&nbsp/&nbsp<span
					  class="details-list__information-2">${vote_count}</span>
			  </li>
			  <li class="details-list__item">
				  <p class="details-list_title">Popularity</p>
				  <span class="details-list__information-2">${popularity}</span>
			  </li>
			  <li class="details-list__item">
				  <p class="details-list_title">Original Title</p>
				  <span class="details-list__information-2 ">${original_title}</span>
			  </li>
			  <li class="details-list__item">
				  <p class="details-list_title">Genre</p>
				  <span class="details-list__information-2">${genres.map(el => {
            return el.name;
          })}</span>
			  </li>
		  </ul>
		  <h3 class="film-details__secondary-title">About</h3>
		  <p class="film-details__about">${overview}</p>
		  <ul class="buttons-list list">
			  <li class="buttons-list__item">
				  <button class="main-button watched-add button" type="button" name="watched">Add to watched</button>
			  </li>
			  <li class="buttons-list__item"><button class="secondary-button queue-add button" type="button" name="queue">Add to queue</button></li>
		  </ul>
		  <div class="trailer"></div>
		  <button class="trailer-button trailer-button--close button is-hidden" type="button">
				  <span class="trailer-button__text trailer-button__text--stop"></span>
			  </button>
	  </div>
  </div>`;

  modal.insertAdjacentHTML('beforeend', markup);
  openModal();

  const queueAddBtn = document.querySelector('.queue-add');

  queueAddBtn?.addEventListener('click', e =>
    Notiflix.Notify.failure(`please log in`)
  );

  viewTrailer(id);

  const watchedAddBtn = document.querySelector('.watched-add');

  watchedAddBtn.addEventListener('click', e =>
    Notiflix.Notify.failure(`please log in`)
  );
};

//----------------------------------
function openModal() {
  const checkModalContentAll = document.querySelectorAll(
    '.film-details-wrapper'
  );
  const checkModalContent = document.querySelector('.film-details-wrapper');
  if (checkModalContentAll?.length >= 2) {
    checkModalContent?.remove();
  }

  const body = document.querySelector('body');
  containerModal.classList.remove('hidden');
  body.style.overflow = 'hidden';
  modalClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', escModal);
  containerModal.addEventListener('click', closeModalOutsideWindow);

  ChangeColorText();

  const modal_text = document.querySelectorAll('.details-list_title');
  const LS = JSON.parse(localStorage.getItem('theme'));
  if (LS) {
    modal_text.forEach(el => (el.style.color = '#ffffff'));
    return;
  }
}

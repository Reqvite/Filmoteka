import { fetchFilmDetails } from '../service/fetchFilmDetails';
import { createFilmDetailsMarkupNoUser } from '../markups/filmDetailMarkup';
import { refs } from '../refs/refs';

import { checkMovieInQueueList } from '../library/myLibrary';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const auth = getAuth();
let userId;

const container = document.querySelector('.container-films');
const modal = document.querySelector('.backdrop-details');
const modalClose = document.querySelector('.modal-icon-cross');

onAuthStateChanged(auth, user => {
  userId = user?.uid;
});

const openModal = async e => {
  e.preventDefault();
  if (e.target.closest('.collection__item')?.dataset.id) {
    const resp = await fetchFilmDetails(
      e.target.closest('.collection__item').dataset.id
    );

    if (userId === undefined) {
      createFilmDetailsMarkupNoUser(resp);
    } else {
      checkMovieInQueueList(resp);
    }
  } else {
    return;
  }
};

container.addEventListener('click', openModal);

export const closeModal = e => {
  const modalContainContainer = document.querySelector('.film-details-wrapper');
  modal.classList.add('hidden');
  modalClose.removeEventListener('click', closeModal);
  document.removeEventListener('keydown', escModal);
  modal.removeEventListener('click', closeModalOutsideWindow);
  refs.body.style.overflow = 'scroll';
  refs.body.style.overflowX = 'hidden';
  modalContainContainer.innerHTML = '';
};

export function ChangeColorText() {
  const modal_text = document.querySelectorAll('.details-list_title');
  const LS = JSON.parse(localStorage.getItem('theme'));
  if (LS) {
    modal_text.forEach(el => (el.style.color = '#ffffff'));
    return;
  }
}

export function escModal(e) {
  if (e.code === 'Escape') {
    closeModal();
  }
}

export function closeModalOutsideWindow(e) {
  if (!e.target.classList.contains('backdrop-details')) {
    return;
  }
  closeModal();
}

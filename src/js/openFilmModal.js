import { fetchFilmDetails } from './service/service';
import { createFilmDetailsMarkup, createFilmDetailsMarkupNoUser } from './markups/filmDetailMarkup';
import { refs } from './refs/refs';
import { remove } from 'firebase/database';
import { checkDataMovie, checkMovieInQueueList, renderModal } from "./myLibrary";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';

const auth = getAuth();
let userId;



const container = document.querySelector('.container-films');
const modal = document.querySelector('.backdrop-details');

const modalClose = document.querySelector('.modal-icon-cross');
const body = document.querySelector('body');

const btnViewAndStopTrailer = document.querySelector('.trailer-button');
const trailer = document.querySelector('.trailer');
// console.log(modal);
// console.log(btnViewAndStopTrailer);
// console.log('Test');
// console.log(trailer);

container.addEventListener('click', e => {
  if (e.target.getAttribute('class')?.includes('test-modal')) {
    modal.classList.remove('is-hidden');
    modalClose.addEventListener('click', e => {
      modal.classList.add('is-hidden');
    });
  }
});

const openModal = async e => {
  e.preventDefault();
  if (e.target.closest('.collection__item')?.dataset.id) {
    const resp = await fetchFilmDetails(
      e.target.closest('.collection__item').dataset.id
    );
   await onAuthStateChanged(auth, user => {
      userId = user?.uid;

      if (userId === undefined) {
        createFilmDetailsMarkupNoUser(resp)
      }else{
         checkMovieInQueueList(resp);
      }
      
    }); 


    //------createFilmDetailsMarkup переніс в checkMovieInQueueList

    //-------переніс код в createFilmDetailsMarkup -----
    //createFilmDetailsMarkup(resp, isAdded);
    // modal.classList.remove('hidden');
    // body.style.overflow = 'hidden';
    // modalClose.addEventListener('click', closeModal);
    // document.addEventListener('keydown', escModal);
    // modal.addEventListener('click', closeModalOutsideWindow);

    // ChangeColorText();

    // const modal_text = document.querySelectorAll('.details-list_title');
    // const LS = JSON.parse(localStorage.getItem('theme'));
    // if (LS) {
    //   modal_text.forEach(el => (el.style.color = '#ffffff'));
    //   return;
    // }
  } else {
    return;
  }
};

container.addEventListener('click', openModal);

export const closeModal = e => {
  const modalContainer = document.querySelector('.film-details-wrapper');
  modal.classList.add('hidden');
  modalClose.removeEventListener('click', closeModal);
  document.removeEventListener('keydown', escModal);
  modal.removeEventListener('click', closeModalOutsideWindow);
  body.style.overflow = 'scroll';
  modalContainer.remove();
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

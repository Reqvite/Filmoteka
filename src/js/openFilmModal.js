import { fetchFilmDetails } from './service/service';
import { createFilmDetailsMarkup } from './markups/filmDetailMarkup';
import { refs } from './refs/refs';
import { remove } from 'firebase/database';

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
    createFilmDetailsMarkup(resp);
    modal.classList.remove('hidden');
    body.style.overflow = 'hidden';
    modalClose.addEventListener('click', closeModal);

    ChangeColorText();

    const modal_text = document.querySelectorAll('.details-list_title');
    const LS = JSON.parse(localStorage.getItem('theme'));
    if (LS) {
      modal_text.forEach(el => (el.style.color = '#ffffff'));
      return;
    }
  } else {
    return;
  }
};

container.addEventListener('click', openModal);

const closeModal = e => {
  const modalContainer = document.querySelector('.film-details-wrapper');
  modal.classList.add('hidden');
  modalClose.removeEventListener('click', closeModal);
  body.style.overflow = 'scroll';
  modalContainer.remove();
};

function ChangeColorText() {
  const modal_text = document.querySelectorAll('.details-list_title');
  const LS = JSON.parse(localStorage.getItem('theme'));
  if (LS) {
    modal_text.forEach(el => (el.style.color = '#ffffff'));
    return;
  }
}

document.addEventListener('keydown', escModal);

function escModal(e) {
  e.preventDefault();
  if (modal.classList.contains('hidden')) {
    return;
  }
  if (e.code === 'Escape') {
    closeModal();
    document.removeEventListener('keydown', escModal);
  }
}

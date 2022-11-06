import { fetchFilmDetails } from './service';
import { createFilmDetailsMarkup } from './markups/filmDetailMarkup';
import { refs } from "./refs/refs";

const container = document.querySelector('.container-films');
const modal = document.querySelector('.backdrop-details');
const modalClose = document.querySelector('.modal-icon-cross');
const body = document.querySelector('body');


const openModal = async e => {
  if (e.target.getAttribute('class')?.includes('card-film')) {
    const resp = await fetchFilmDetails(
      e.target.closest('.card-film').dataset.id
    );
    createFilmDetailsMarkup(resp);
    modal.classList.remove('hidden');
    body.style.overflow = 'hidden';
    modalClose.addEventListener('click', closeModal);
    ChangeColorText();
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
    modal_text.forEach(el => el.style.color = '#ffffff');
    return;
  }
}
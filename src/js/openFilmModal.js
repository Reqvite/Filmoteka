import { fetchFilmDetails } from "./service";
import { createFilmDetailsMarkup } from "./markups/filmDetailMarkup";

const container = document.querySelector('.container-films')
const modal = document.querySelector('.backdrop-details');
const modalClose = document.querySelector('.modal-icon-cross');
const body = document.querySelector('body')

const openModal = async e => {
    if (e.target.getAttribute('class')?.includes('card-film')) {
        const resp = await fetchFilmDetails(e.target.closest('.card-film').dataset.id)
        createFilmDetailsMarkup(resp)
        modal.classList.remove('hidden') 
        body.style.overflow = 'hidden'
        modalClose.addEventListener('click', closeModal)
    }
}

container.addEventListener('click', openModal)

const  closeModal = e =>{
    const modalContainer = document.querySelector('.film-details-wrapper')
    modal.classList.add('hidden');
    modalClose.removeEventListener('click', closeModal);
    body.style.overflow = 'scroll'
    modalContainer.remove();
}





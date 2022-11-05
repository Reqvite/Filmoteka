import { fetchFilmDetails } from "./service";
import { createFilmDetailsMarkup } from "./markups/filmDetailMarkup";


const container = document.querySelector('.container-films')
const modal = document.querySelector('.film-modal');
const modalClose = document.querySelector('.modal-icon-cross');



const openModal = async (e) => {
    if (e.target.getAttribute('class')?.includes('card-film')) {
        const resp = await fetchFilmDetails(e.target.closest('.card-film').dataset.id)
        createFilmDetailsMarkup(resp)
        modal.classList.remove('hidden') 
        modalClose.addEventListener('click', closeModal)
    }
}

container.addEventListener('click', openModal);


function closeModal(e) {
    const modalContainer = document.querySelector('.film-details-wrapper')
    modal.classList.add('hidden');
    modalClose.removeEventListener('click', closeModal);
    modalContainer.remove();
}





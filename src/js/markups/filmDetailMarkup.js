import { fetchFilmDetails } from "../service";

const modal = document.querySelector('.film-details-wrapper');
const modalBottom = document.querySelector('.film-details')

const createFilmDetailsMarkup = async () => {
    const resp = await fetchFilmDetails();
    const { poster_path, original_title, vote_average, vote_count, popularity, genres, overview } = resp.data;  

    const markup = `
  <div><img class="modal-img" src="https://image.tmdb.org/t/p/original/${poster_path}" alt="" /></div>`
    
 const markupBottom =  `
    <h2 class="film-details__main-title">${original_title}</h2>
    <ul class="details-list list">
      <li class="details-list__item">
        <p class="details-list_title">Vote / Votes</p>
        <span class="details-list__information-1">${vote_average}</span>&nbsp/&nbsp<span class="details-list__information-2">${vote_count}</span>
      </li>
      <li class="details-list__item">
        <p class="details-list_title">Popularity</p>
        <span class="details-list__information">${popularity}</span>
      </li>
      <li class="details-list__item">
        <p class="details-list_title">Original Title</p>
        <span class="details-list__information">${original_title}</span>
      </li>
      <li class="details-list__item">
        <p class="details-list_title">Genre</p>
        <span class="details-list__information">${genres.map(el => {
            return el.name
        })}</span>
      </li>
    </ul>
    <h3 class="film-details__secondary-title">About</h3>
    <p class="film-details__about">${overview}</p>
  </div>`
    
  modal.insertAdjacentHTML("afterbegin", markup) 
  modalBottom.insertAdjacentHTML("afterbegin", markupBottom) 
}

createFilmDetailsMarkup()
 
 
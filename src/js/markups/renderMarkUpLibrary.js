import { refs } from '../refs/refs';
import * as image from '../../images/library/empty-library.png';
import img from '../../images/collection/csaff-no-poster.jpg';

const renderMurkUpLibrary = queueList => {

  let rating = null;

  const markup = queueList.reduce((acc, obj) => {
    const { id, poster_path, title, release_date, vote_average, genres } = obj;


    // poster_path
    //           ? poster_path = `https://www.themoviedb.org/t/p/w500/${poster_path}`
    //           : poster_path = img
           // vote_average ? vote_average = vote_average.toFixed(1) : (vote_average = '?')

              if (vote_average >= 7) {
                rating = 'masterpiece'
              }else if (vote_average >= 5 && vote_average <= 7) {
                rating = 'good'
              }else if(vote_average <= 5) {
                rating = 'bad'
              }

    const genreNames = genres.map(gender => gender.name);
    const releaseYear = release_date.split('-');

    return (
      acc +
      `<li class="collection__item" data-id=${id}>
        <a href="" class="card-wrap__link link">
              <div class="card">
              <div class="card__image-wrap">
                      <img class="card__image" src="https://www.themoviedb.org/t/p/w500/${poster_path}" alt="${title}" width="395px" height="574px">
                       </div>
                  <div class="card__wrap">
                      <h2 class="card__title">${title}</h2>
                      <div class="card__data">
                          <p class="card__genre">${genreNames.join(', ')} |</p>
                          <p class="card__year">${releaseYear[0]}</p>
                          <p class="card-film__rating">${vote_average}</p>
                      </div>
                  </div>
              </div>
              </a>
          </li>
               `
    );
  }, '');

  return (refs.gallery.innerHTML = markup);
};

const clearContainer = () => {
  const title = `
  <img
  src="${image}"
  alt="foto"
  width="300px" height="300px"
/>
  `;
  refs.gallery.innerHTML = title;
};

export { renderMurkUpLibrary, clearContainer };

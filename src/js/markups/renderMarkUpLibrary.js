import { refs } from '../refs/refs';
import * as image from '../../images/library/empty-library.jpg';

const renderMurkUpLibrary = queueList => {
  const markup = queueList.reduce((acc, obj) => {
    const { id, poster_path, title, release_date, vote_average, genres } = obj;

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
  width="250px" height="250px"
/>
  `;
  refs.gallery.innerHTML = title;
};

export { renderMurkUpLibrary, clearContainer };

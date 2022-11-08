import * as image from '../../images/collection/csaff-no-poster.jpg';
export function renderMarkUp(arrMovies, genreCollection) {

  return arrMovies
    .map(
      ({ poster_path, genre_ids, title, release_date, id, vote_average }) => {
            let genreNames = genre_ids.map(id => genreCollection[id]);
        if (genreNames.length >= 3) {
          genreNames = [genreNames[0], genreNames[1], 'Other'];
        }
        
        genreNames.length !== 0
          ? (genreNames = `${genreNames.join(', ')} |`)
          : (genreNames = '');
            poster_path
              ? (poster_path = `https://www.themoviedb.org/t/p/original/${poster_path}`)
              : (poster_path = image);
            release_date ? release_date = new Date(release_date).getFullYear() : release_date = '';
            vote_average
              ? vote_average = vote_average.toFixed(1)
              : (vote_average = '?');

             return `
  <li class="collection__item" data-id=${id}>
  <a href="" class="card-wrap__link link">
        <div class="card">
            <div class="card__image-wrap">
                <img class="card__image" src=${poster_path} alt="${title}" >
            </div>
            <div class="card__wrap">
                <h2 class="card__title">${title}</h2>
                <div class="card__data">
                    <p class="card__genre">${genreNames}</p>
                    <p class="card__year">${release_date}</p>
                    <p class="card-film__rating">${vote_average}</p>
                </div>
            </div>
        </div>
        </a>
    </li>
         `;
      }
    )
    .join('');
}



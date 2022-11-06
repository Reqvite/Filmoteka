export function renderMarkUp(arrMovies, genreCollection) {

  return arrMovies
    .map(
      ({ poster_path, genre_ids, title, release_date, id, vote_average }) => {
            let genreNames = genre_ids.map(id => {
               return genreCollection[id]
            });
        if (genreNames.length >= 3) {
          genreNames = [genreNames[0], genreNames[1], 'Other'];
        }

             return `
  <li class="collection__item" data-id=${id}>
  <a href="" class="card-wrap__link link">
        <div class="card">
                <img class="card__image" src="https://www.themoviedb.org/t/p/original/${poster_path}" alt="${title}" width="395px" height="574px">
            <div class="card-wrap">
                <h2 class="card__title">${title}</h2>
                <div class="card__data">
                    
                    <p class="card__genre">${genreNames.join(', ')} |</p>
                   

                    <p class="card__year">${new Date(
                      release_date
                    ).getFullYear()}</p>
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



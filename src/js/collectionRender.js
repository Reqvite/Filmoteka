import { buildUrl } from './collectionFetch';

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

// pagination var Vlad Lysenko
// export function renderPagination(currentPage, total_pages) {
//     let paginationArr = [];
//     let paginationLinks = "";
//     // var 1
//     if (currentPage <= 3) {
//         if (currentPage > 2) {
//           paginationArr.push(currentPage - 2 );
//         }
//         if (currentPage > 1) {
//           paginationArr.push(currentPage - 1 );
//         }
//         paginationArr.push(currentPage);
//         paginationArr.push(currentPage + 1);
//         paginationArr.push(currentPage + 2);
//         if (currentPage < 3) {
//             paginationArr.push(currentPage + 3);
//         }
//         paginationArr.push("...");
//         paginationArr.push(total_pages);
//     // var 2
//     } else if (currentPage > 3 && (total_pages - currentPage) > 3) {
//         paginationArr.push(1);
//         paginationArr.push("...");
//         if (currentPage > 4) {
//             paginationArr.push(currentPage - 2);
//         }
//         paginationArr.push(currentPage - 1);
//         paginationArr.push(currentPage);
//         paginationArr.push(currentPage + 1);
//         paginationArr.push(currentPage + 2);
//         paginationArr.push("...");
//         paginationArr.push(total_pages);
//     } else {
//         paginationArr.push(1);
//         paginationArr.push("...");
//         paginationArr.push(currentPage - 2);
//         paginationArr.push(currentPage - 1);
//         paginationArr.push(currentPage);
//         if ((total_pages - currentPage) >= 3) {
//             paginationArr.push(currentPage + 1);
//             paginationArr.push(currentPage + 2);
//         }
//         if (currentPage !== total_pages ) {
//             paginationArr.push(total_pages);
//         }
//     }

//     paginationArr.forEach(pageNumber => {
//         let activeClass = pageNumber === currentPage ? "active" : "";

//         paginationLinks = paginationLinks + `<li class="pagination__item"><a data-page="${pageNumber}" href="${buildUrl(pageNumber)}" class="pagination__link ${activeClass} ">${pageNumber}</a></li>`

//     });

//     return `
//     <ul class="pagination__list">
//         <li class="pagination__item"><a href="" class="pagination__link">&lt;</a></li>
//         ${paginationLinks}
//         <li class="pagination__item"><a href="" class="pagination__link">&gt;</a></li>
//     </ul>
//     `

// }

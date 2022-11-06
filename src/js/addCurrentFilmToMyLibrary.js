import Notiflix from 'notiflix';

const container = document.querySelector('.container-films');
const myLibraryBtn = document.querySelector('.my-library-js');

let dataWatched = [];

export function onClickAddToWached(data) {
  const idMovie = data.id;
  const watchedMovieInLS = JSON.parse(localStorage.getItem('watched'));

  if (dataWatched.some(obj => obj.id === idMovie)) {
    Notiflix.Notify.info(`Тhis movie has already been added to the Watched`, {
      timeout: 2000,
    });
    return;
  }

  if (watchedMovieInLS !== null) {
    const checkingListWatchedArr = watchedMovieInLS.some(
      obj => obj.id === idMovie
    );

    if (checkingListWatchedArr) {
      Notiflix.Notify.info(`Тhis movie has already been added to the Watched`, {
        timeout: 2000,
      });

      return;
    } else {
      watchedMovieInLS.push(data);
      localStorage.setItem('watched', JSON.stringify(watchedMovieInLS));

      Notiflix.Notify.success(`Add movie`, {
        timeout: 2000,
      });
    }
    return;
  }

  dataWatched.push(data);
  localStorage.setItem('watched', JSON.stringify(dataWatched));

  Notiflix.Notify.success(`Add movie`, {
    timeout: 2000,
  });
}

// ------------------click my library-------------

// const onMyLibararyClick = e => {
//   if (e.target.name !== 'library') {
//     return;
//   }

//   const moviesListLocalStorage = JSON.parse(localStorage.getItem('watched'));
//   if (moviesListLocalStorage === null) {
//     Notiflix.Notify.failure(`my library is emty`, {
//       timeout: 2000,
//     });
//     return;
//   }
//   const renderLibrary = fotoCardsTpl(moviesListLocalStorage);
//   container.innerHTML = renderLibrary;
// };

// refs.headerNavList.addEventListener('click', onMyLibararyClick);

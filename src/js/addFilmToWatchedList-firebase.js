import Notiflix from 'notiflix';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getDatabase,
  ref,
  child,
  update,
  get,
  onValue,
  set,
  push,
} from 'firebase/database';
import { database } from './firebase';
import { refs } from './refs/refs';
import {
  renderMurkUpLibrary,
  clearContainer,
} from './markups/renderMarkUpLibrary';
import { spinner } from './spinner';
import { closeModal } from './openFilmModal';
export { onClickAddToWatched };

const dbRef = ref(getDatabase());
const auth = getAuth();
const user = auth.currentUser;
let userId;

onAuthStateChanged(auth, user => {
  userId = user?.uid;
});
// let isAddedToWatchedf = null;
// get(child(dbRef, `users/${userId}`))
//   .then(snapshot => {
//     if (snapshot.exists()) {
//       const watchedDataString = snapshot.val().watchedList;
//       const watchedList =
//         (watchedDataString && JSON.parse(watchedDataString)) || [];

//       isAddedToWatchedf = watchedList.some(obj => obj.id === idMovie);
//     } else {
//       console.log('No data available');
//     }
//   })
//   .catch(error => {
//     console.error(error);
//   });

//Кнопка add-remove  watched
const onClickAddToWatched = (data, isAddedToWatched) => {
  let userIsLogin = JSON.parse(localStorage.getItem('userIsLogin'));
  let listWatchedArr = [];
  const idMovie = data.id;
  const watchedAddBtn = document.querySelector('.watched-add');
  const homeActive = document.querySelector('.home-js');

  if (userIsLogin) {
    // --------------видалення зі списку watched--------------
    if (isAddedToWatched) {
      console.log(isAddedToWatched, ' функція видаляє');
      closeModal();
      watchedAddBtn.textContent = 'add to wached';

      get(child(dbRef, `users/${userId}`))
        .then(snapshot => {
          if (snapshot.exists()) {
            const watchedDataString = JSON.parse(snapshot.val().watchedList);
            const afterRemovalWatchedData = watchedDataString.filter(
              (obj, idx, arr) => {
                if (obj.id === idMovie) {
                  return false;
                }
                return arr.push(obj);
              }
            );

            if (
              afterRemovalWatchedData.length === 0
              // &&
              // homeActive.dataset.active !== 'true'
            ) {
              clearContainer();
              closeModal();
              update(ref(database, 'users/' + userId), {
                watchedList: '',
              });
              return;
            }

            if (homeActive.dataset.active !== 'true') {
              renderMurkUpLibrary(afterRemovalWatchedData);
              closeModal();
            }
            const newWatchedListString = JSON.stringify(
              afterRemovalWatchedData
            );
            update(ref(database, 'users/' + userId), {
              watchedList: newWatchedListString,
            });

            Notiflix.Notify.success(`removed movie from Watched`);
          } else {
            console.log('No data available');
          }
        })
        .catch(error => {
          console.error(error);
        });
    }

    // додавання у список watched
    if (!isAddedToWatched) {
      console.log(isAddedToWatched, ' функція додає');
      closeModal();
      watchedAddBtn.textContent = 'remove from watched';
      get(child(dbRef, `users/${userId}`))
        .then(snapshot => {
          if (snapshot.exists()) {
            const watchedDataString = snapshot.val().watchedList;

            if (watchedDataString === '') {
              Notiflix.Notify.success(`Added movie to watched list.`);
              listWatchedArr.push(data);
              const watchedToString = JSON.stringify(listWatchedArr);

              update(ref(database, 'users/' + userId), {
                watchedList: watchedToString,
              });
            } else {
              const watchedArr = JSON.parse(watchedDataString);
              const checkArr = watchedArr.some(obj => obj.id === idMovie);

              if (checkArr) {
                // Notiflix.Notify.info(`This movie is in the watched list.`);
              } else {
                watchedArr.push(data);
                const watchedListString = JSON.stringify(watchedArr);

                update(ref(database, 'users/' + userId), {
                  watchedList: watchedListString,
                });

                Notiflix.Notify.success(`Added movie to watched list.`);
              }
            }
          } else {
            console.log('No data available');
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  } else {
    Notiflix.Notify.failure(`Please log in`);
    return;
  }
};

// Кнопка Watched
const onWatchedBtnClick = e => {
  refs.queueBtnInLibrary.classList.remove('header__mylibrary-btn--active');
  refs.watchedBtnInLibrary.classList.add('header__mylibrary-btn--active');
  refs.gallery.innerHTML = '';
  spinner();

  get(child(dbRef, `users/${userId}`))
    .then(snapshot => {
      if (snapshot.exists()) {
        const watchedList = snapshot.val().watchedList;

        if (watchedList === '') {
          clearContainer();
        } else {
          const watchedListArr = JSON.parse(snapshot.val().watchedList);
          renderMurkUpLibrary(watchedListArr);
        }
      } else {
        console.log('No data available');
      }
      spinner();
    })
    .catch(error => {
      console.error(error);
    });

  if (
    refs.watchedBtnInLibrary.classList.contains('header__mylibrary-btn--active')
  ) {
    return;
  }
};

refs.watchedBtnInLibrary.addEventListener('click', onWatchedBtnClick);

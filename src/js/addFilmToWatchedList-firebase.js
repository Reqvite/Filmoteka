import Notiflix from 'notiflix';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, child, update, get } from 'firebase/database';
import { database } from './firebase';
import { refs } from './refs/refs';

import {
  renderMurkUpLibrary,
  clearContainer,
} from './markups/renderMarkUpLibrary';

export { onClickAddToWatched };

//кнопка add to watched

const onClickAddToWatched = (data, e) => {
  const idMovie = data.id;
  const userIsLogin = JSON.parse(localStorage.getItem('userIsLogin'));
  const dbRef = ref(getDatabase());
  let listWatchedArr = [];

  if (userIsLogin) {
    onAuthStateChanged(getAuth(), user => {
      const uid = user.uid;
      if (user) {
        get(child(dbRef, `users/${uid}`))
          .then(snapshot => {
            if (snapshot.exists()) {
              const watchedDataString = snapshot.val().watchedList;
              if (watchedDataString === '') {
                listWatchedArr.push(data);
                const watchedToString = JSON.stringify(listWatchedArr);
                update(ref(database, 'users/' + uid), {
                  watchedList: watchedToString,
                });
              } else {
                const watchedArr = JSON.parse(watchedDataString);
                const checkArr = watchedArr.some(obj => obj.id === idMovie);

                if (checkArr) {
                  Notiflix.Notify.info(`This movie is in the watched list.`);
                } else {
                  watchedArr.push(data);
                  const watchedListString = JSON.stringify(watchedArr);

                  //  Перезапис watchedlist
                  update(ref(database, 'users/' + uid), {
                    watchedList: watchedListString,
                  });
                  Notiflix.Notify.success(`Added movie to watched list.`);
                }
              }
            } else {
              Notiflix.Notify.failure(`No data available`);
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    });
  } else {
    Notiflix.Notify.failure(`Please log in`);
    return;
  }
};

// Кнопка Watched

const onWatchedBtnClick = e => {
  console.log('watched');
  refs.queueBtnInLibrary.classList.remove('header__mylibrary-btn--active');
  refs.watchedBtnInLibrary.classList.add('header__mylibrary-btn--active');

  const dbRef = ref(getDatabase());
  onAuthStateChanged(getAuth(), user => {
    if (user) {
      const uid = user.uid;

      get(child(dbRef, `users/${uid}`))
        .then(snapshot => {
          if (snapshot.exists()) {
            const watchedList = snapshot.val().watchedList;

            if (watchedList === '') {
              clearContainer();
              Notiflix.Notify.failure(`Opps🙊 your watched list is empty!`);
            } else {
              const watchedListArr = JSON.parse(snapshot.val().watchedList);
              renderMurkUpLibrary(watchedListArr);
            }
          } else {
            console.log('No data available');
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  });
  if (
    refs.watchedBtnInLibrary.classList.contains('header__mylibrary-btn--active')
  ) {
    return;
  }
};
refs.watchedBtnInLibrary.addEventListener('click', onWatchedBtnClick);

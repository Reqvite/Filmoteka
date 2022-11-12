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

const updateWatched = (database, userId, watchedListString) => {
  update(ref(database, 'users/' + userId), {
    watchedList: watchedListString,
  });
};

onAuthStateChanged(auth, user => {
  userId = user?.uid;
});

//Кнопка add-remove  watched
const onClickAddToWatched = (data, isAddedToWatchedf) => {
  let userIsLogin = JSON.parse(localStorage.getItem('userIsLogin'));
  let listWatchedArr = [];
  const idMovie = data.id;
  const watchedAddBtn = document.querySelector('.watched-add');
  const homeActive = document.querySelector('.home-js');

  if (userIsLogin) {
    // ---------Перевірка чи є фільм у списку-----------------
    get(child(dbRef, `users/${userId}`))
      .then(snapshot => {
        if (snapshot.exists()) {
          const watchedDataString = snapshot.val().watchedList;
          let result;

          if (watchedDataString === '' || watchedDataString === '[]') {
            result = false;
          } else {
            const watchedDataString = snapshot.val().watchedList;
            const watchedList =
              (watchedDataString && JSON.parse(watchedDataString)) || [];
            result = watchedList.some(obj => obj.id === idMovie);
          }
          // --------------видалення зі списку watched--------------
          if (result) {
            watchedAddBtn.textContent = 'add to watched';
            get(child(dbRef, `users/${userId}`))
              .then(snapshot => {
                if (snapshot.exists()) {
                  if (
                    snapshot.val().watchedList === '' ||
                    snapshot.val().watchedList === '[]'
                  ) {
                  } else {
                    const watchedDataString = JSON.parse(
                      snapshot.val().watchedList
                    );
                    const afterRemovalWatchedData = watchedDataString.filter(
                      (obj, idx, arr) => {
                        if (obj.id === idMovie) {
                          return false;
                        }
                        return arr.push(obj);
                      }
                    );
                    if (
                      refs.queueBtnInLibrary.classList.contains(
                        'header__mylibrary-btn--active'
                      )
                    ) {
                      console.log(
                        refs.queueBtnInLibrary.classList.contains(
                          'header__mylibrary-btn--active'
                        )
                      );
                    } else {
                      if (
                        afterRemovalWatchedData.length === 0 &&
                        homeActive.dataset.active !== 'true'
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
                    }
                    update(ref(database, 'users/' + userId), {
                      watchedList: '',
                    });
                    const newWatchedListString = JSON.stringify(
                      afterRemovalWatchedData
                    );
                    update(ref(database, 'users/' + userId), {
                      watchedList: newWatchedListString,
                    });
                  }

                  Notiflix.Notify.success(`Removed movie from Watched`);
                } else {
                  console.log('No data available');
                }
              })
              .catch(error => {
                console.error(error);
              });
          }

          // ---------------додавання у список watched--------
          if (!result) {
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
                    watchedArr.push(data);
                    const watchedListString = JSON.stringify(watchedArr);
                    update(ref(database, 'users/' + userId), {
                      watchedList: watchedListString,
                    });
                    Notiflix.Notify.success(`Added movie to watched list.`);
                  }
                } else {
                  console.log('No data available');
                }
              })
              .catch(error => {
                console.error(error);
              });
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  } else {
    Notiflix.Notify.failure(`Please, log in!`);
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

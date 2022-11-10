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

export { onClickAddToWatched };

let userIsLogin = JSON.parse(localStorage.getItem('userIsLogin'));
const dbRef = ref(getDatabase());
let userId;
const auth = getAuth();
const user = auth.currentUser;

onAuthStateChanged(auth, user => {
  userId = user?.uid;
});

//кнопка add to watched

const onClickAddToWatched = (data, e) => {
  const idMovie = data.id;
  let listWatchedArr = [];
  if (userIsLogin) {
    get(child(dbRef, `users/${userId}`))
      .then(snapshot => {
        if (snapshot.exists()) {
          const watchedDataString = snapshot.val().watchedList;

          if (watchedDataString === '') {
            listWatchedArr.push(data);
            const watchedToString = JSON.stringify(listWatchedArr);

            update(ref(database, 'users/' + userId), {
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
          Notiflix.Notify.failure(`Opps🙊 your watched list is empty!`);
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

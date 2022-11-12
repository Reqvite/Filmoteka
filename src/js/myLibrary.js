import Notiflix from 'notiflix';
import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import { getDatabase, ref, child, update, get } from 'firebase/database';
import {database } from './firebase';

import { refs } from './refs/refs';
import {
  renderMurkUpLibrary,
  clearContainer,
} from './markups/renderMarkUpLibrary';

import { createFilmDetailsMarkup } from './markups/filmDetailMarkup';
import { closeModal } from './openFilmModal';

import { spinner } from './spinner';

const auth = getAuth();
let userId;
const dbRef = ref(getDatabase());


const USER_LOGIN_KEY = 'userIsLogin';

onAuthStateChanged(auth, user => {
  userId = user?.uid;
});

const updateUser = (database, userId, queueListString) =>{
  update(ref(database, 'users/' + userId), {
    queueList: queueListString,
  });
}

//----------------------- click add to queue---------------

const onClickBtnToQueue = (data, e) => {

  const queueAddBtn = document.querySelector('.queue-add');
  const removeBtn = document.querySelector('.remove-from-queue');

  removeBtn.classList.remove('hidden')
  queueAddBtn.classList.add('hidden');
 

  const idMovie = data.id;

  /*-------перевіряю чи залогінився юзер ------------*/
  const userIsLogin = JSON.parse(localStorage.getItem(USER_LOGIN_KEY));

  if (userIsLogin) {
    get(child(dbRef, `users/${userId}`))
        .then(snapshot => {
          if (snapshot.exists()) {
            const queueDataString = snapshot.val().queueList;

            if (queueDataString === '') {

              Notiflix.Notify.success(`Added movie to QUEUE`, {
                  timeout: 1000,
              });

              let listWatchedArr = [];
              listWatchedArr.push(data);

              const queueListString = JSON.stringify(listWatchedArr);

              updateUser(database, userId, queueListString);

            } else {
              const queueDataArr = JSON.parse(queueDataString);

              // ---------добавляю новий об'єк в масив і перезаписую data-------------
              queueDataArr.push(data);
              const queueListString = JSON.stringify(queueDataArr);

              updateUser(database, userId, queueListString);

              Notiflix.Notify.success(`Added movie to QUEUE`, {
                timeout: 1000,
              });

              /*---- перевіряю  масив на однакові id і добавляю новий об'єкт-------*/
              //const checkArr = queueDataArr.some(obj => obj.id === idMovie);
              //listWatchedArr.map(obj => obj.id).includes(idMovie) // інший спосіб

              // if (checkArr) {
              //   Notiflix.Notify.info(`Тhis movie is in the QUEUE`, {
              //     timeout: 1000,
              //   });
              // } else {
              //   // ---------добавляю новий об'єк в масив і перезаписую data-------------
              //   queueDataArr.push(data);
              //   const queueListString = JSON.stringify(queueDataArr);

              //   update(ref(database, 'users/' + userId), {
              //     queueList: queueListString,
              //   });

              //   Notiflix.Notify.success(`Added movie to QUEUE`, {
              //     timeout: 1000,
              //   });

              // }
            }
          } else {
            Notiflix.Notify.failure(`No data available`, {
              timeout: 1000,
            });
            console.log('No data available');
          }
        })
        .catch(error => {
          console.error(error);
        });
  } else {
    Notiflix.Notify.failure(`Please, log in!`, {
      timeout: 1000,
    });
    return;
  }
};

//----------------click remove from queue btn-------------

const onRemoveQueueBtnClick = (data, e) => {

  const idMovie = data.id;

  const removeFromQueueBtn = document.querySelector('.remove-from-queue');
  const queueAddBtn = document.querySelector('.queue-add');
  
  removeFromQueueBtn.classList.add('hidden');
  queueAddBtn.classList.remove('hidden');

  get(child(dbRef, `users/${userId}`)).then((snapshot) => {

    if (snapshot.exists()) {

        const queueListArr = JSON.parse(snapshot.val().queueList);

          // -----------видаляю фільм із списку ------------//
        const newQueueListArr = queueListArr.filter((obj, idx, arr) =>{
            if (obj.id === idMovie) {
                return false
            };
           return arr.push(obj)
        });
        
        if (newQueueListArr.length === 0 && homeActive.dataset.active !== 'true') {
          clearContainer();
          closeModal();

          const string = ''
            updateUser(database, userId, string);
            return; 
        } 
        
        if (homeActive.dataset.active !== 'true') {
          renderMurkUpLibrary(newQueueListArr);
          closeModal();        
        };

        const newQueueListString = JSON.stringify(newQueueListArr);

        updateUser(database, userId, newQueueListString); 

        Notiflix.Notify.success(`Removed movie from QUEUE`,{
            timeout: 1000,
        });
        

    } else {
    console.log("No data available");
}
}).catch((error) => {
console.error(error);
});  

}

// ------------------click my library-------------
const homeActive = document.querySelector('.home-js');

const onMyLibararyClick = e => {
  if (e.target.nodeName === 'LI' || e.target.nodeName === 'UL') {
    return
  }
  if (e.target.name === 'library' ) {
       homeActive.setAttribute('data-active', false);
       refs.gallery.innerHTML = '';
       spinner();
  };
  
    if (e.target.name !== 'library' ) {
      refs.listEl.classList.remove('is-hidden');
             homeActive.setAttribute('data-active', true)
  
        return; 
    };

  refs.listEl.classList.add('is-hidden');
  refs.watchedBtnInLibrary.classList.remove('header__mylibrary-btn--active');
  refs.queueBtnInLibrary.classList.add('header__mylibrary-btn--active');

  if (homeActive.dataset.active === 'true') {
    return;
  }

  get(child(dbRef, `users/${userId}`)).then((snapshot) => {
      
    if (snapshot.exists()) {
        const queueListData = snapshot.val().queueList

        if (queueListData === '' || queueListData === '[]') {
            clearContainer();
            
          }else{
            const queueList = JSON.parse(snapshot.val().queueList)
            renderMurkUpLibrary(queueList);
        };   
    } else {
    console.log("No data available");
    }
      spinner();
})
.catch(error => {
console.error(error);
});
};

refs.headerNavList.addEventListener('click', onMyLibararyClick);

// -----------click queue btn in library--------
const onQueueBtnClickinLibrary = e => {

  refs.watchedBtnInLibrary.classList.remove('header__mylibrary-btn--active');
  refs.queueBtnInLibrary.classList.add('header__mylibrary-btn--active');
  refs.gallery.innerHTML = '';
  spinner();

  get(child(dbRef, `users/${userId}`))
        .then(snapshot => {
          if (snapshot.exists()) {
            const queueListData = snapshot.val().queueList;
            if (queueListData === '') {
              clearContainer();

            } else {
              const queueList = JSON.parse(snapshot.val().queueList);
              
              renderMurkUpLibrary(queueList);
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
    refs.queueBtnInLibrary.classList.contains('header__mylibrary-btn--active')
  ) {
    return;
  }
};

refs.queueBtnInLibrary.addEventListener('click', onQueueBtnClickinLibrary);

// ---------перевтряю чи є фільм в масиві для кнопки queue в --------

const checkMovieInQueueList = async resp => {
  const data = resp.data;
  const idMovie = data.id;

  // if (homeActive.dataset.active === 'true') {
  //     return;
  //   };

  get(child(dbRef, `users/${userId}`))
    .then(snapshot => {
      if (snapshot.exists()) {
        const rawListQueue = snapshot.val().queueList;
        const queueList = (rawListQueue && JSON.parse(rawListQueue)) || [];
        const isAdded = queueList.some(obj => obj.id === idMovie);
        // ----------watched
        const watchedDataString = snapshot.val().watchedList;
        const watchedList =
          (watchedDataString && JSON.parse(watchedDataString)) || [];

        const isAddedToWatched = watchedList.some(obj => obj.id === idMovie);

        createFilmDetailsMarkup(resp, isAdded, isAddedToWatched);
      } else {
        console.log('No data available');
      }
    })
    .catch(error => {
      console.error(error);
    });
};

export { onClickBtnToQueue, checkMovieInQueueList, onRemoveQueueBtnClick };

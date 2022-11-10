import Notiflix from 'notiflix';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { getDatabase, ref, child, push, update, get } from 'firebase/database';
import { AuthState, database, getAuthState } from './firebase';

import { refs } from './refs/refs';
import { renderMarkUp } from './markups/collectionRender';
import { fetchGenreId } from './collectionFetch';
import {
  renderMurkUpLibrary,
  clearContainer,
} from './markups/renderMarkUpLibrary';

import { createFilmDetailsMarkup } from './markups/filmDetailMarkup';
import { closeModal } from './openFilmModal';

import { spinner } from "./spinner";


const auth = getAuth();
let userId;
const dbRef = ref(getDatabase());
const USER_LOGIN_KEY = 'userIsLogin';



onAuthStateChanged(auth, user => {
  userId = user?.uid;
});

//------------------------add to queue---------------

const onClickBtnToQueue = (data, e) => {

  const queueAddBtn = document.querySelector('.queue-add');
  // queueAddBtn.removeEventListener('click',function myClick (e){ onClickBtnToQueue(resp.data, e)});

  queueAddBtn.textContent = 'REMOVE FROME QUEUE';
  queueAddBtn.classList.add('remove-from-queue');
  queueAddBtn.classList.remove('queue-add');


  // const removeFromQueueBtn = document.querySelector('.remove-from-queue');
  // removeFromQueueBtn.addEventListener('click', function click( e ){onRemoveQueueBtnClick(resp.data, e)});

  //closeModal();
 
  const idMovie = data.id;

  /*-------перевіряю чи залогінився юзер ------------*/
  const userIsLogin = JSON.parse(localStorage.getItem(USER_LOGIN_KEY));

  if (userIsLogin) {
    get(child(dbRef, `users/${userId}`))
        .then(snapshot => {
          if (snapshot.exists()) {
            const queueDataString = snapshot.val().queueList;
            if (queueDataString === '') {
              let listWatchedArr = [];
              listWatchedArr.push(data);

              const queueListString = JSON.stringify(listWatchedArr);

              update(ref(database, 'users/' + userId), {
                queueList: queueListString,
              });
            } else {
              const queueDataArr = JSON.parse(queueDataString);

              /*---- перевіряю  масив на однакові id і добавляю новий об'єкт-------*/
              const checkArr = queueDataArr.some(obj => obj.id === idMovie);
              //listWatchedArr.map(obj => obj.id).includes(idMovie) // інший спосіб

              if (checkArr) {
                Notiflix.Notify.info(`Тhis movie is in the QUEUE`, {
                  timeout: 2000,
                });
              } else {
                // ---------добавляю новий об'єк в масив і перезаписую data-------------
                queueDataArr.push(data);
                const queueListString = JSON.stringify(queueDataArr);

                update(ref(database, 'users/' + userId), {
                  queueList: queueListString,
                });

                Notiflix.Notify.success(`Added movie to QUEUE`, {
                  timeout: 2000,
                });

              }
            }
          } else {
            Notiflix.Notify.failure(`No data available`, {
              timeout: 2000,
            });
            console.log('No data available');
          }
        })
        .catch(error => {
          console.error(error);
        });
  } else {
    Notiflix.Notify.failure(`please log in`, {
      timeout: 2000,
    });
    return;
  }
};

//----------------click remove from queue btn-------------

const onRemoveQueueBtnClick = (data, e) => {

  const idMovie = data.id;
  
  const removeFromQueueBtn = document.querySelector('.remove-from-queue');
  removeFromQueueBtn.textContent = 'ADD TO QUEUE';
  removeFromQueueBtn.classList.add('queue-add');
  removeFromQueueBtn.classList.remove('remove-from-queue');

 //closeModal();


  get(child(dbRef, `users/${userId}`)).then((snapshot) => {

    if (snapshot.exists()) {

        const queueListArr = JSON.parse(snapshot.val().queueList);

        const newQueueListArr = queueListArr.filter((obj, idx, arr) =>{
            if (obj.id === idMovie) {
                return false
            };
           return arr.push(obj)
        });
        
        if (newQueueListArr.length === 0 && homeActive.dataset.active !== true) {
          clearContainer();
          closeModal();
            update(ref(database, 'users/' + userId),{
                queueList: ''
            }); 
            return; 
        } 
        
        if (homeActive.dataset.active !== true) {
          console.log(homeActive.dataset.active);
          renderMurkUpLibrary(newQueueListArr);
          closeModal();
          
        };

        const newQueueListString = JSON.stringify(newQueueListArr);
        update(ref(database, 'users/' + userId),{
            queueList: newQueueListString
        }); 

        Notiflix.Notify.success(`removed movie from QUEUE`,{
            timeout: 2000,
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
  if (e.target.name === 'library') {
       homeActive.setAttribute('data-active', false);
       refs.gallery.innerHTML = '';
       spinner();
  };
  
    if (e.target.name !== 'library') {
      refs.listEl.classList.remove('is-hidden');
             homeActive.setAttribute('data-active', true)
  
        return; 
    };

    console.log(homeActive.dataset.active);

    refs.listEl.classList.add('is-hidden');
  refs.watchedBtnInLibrary.classList.remove('header__mylibrary-btn--active');
  refs.queueBtnInLibrary.classList.add('header__mylibrary-btn--active');

  if (homeActive.dataset.active === 'true') {
    return;
  }

  get(child(dbRef, `users/${userId}`)).then((snapshot) => {
      
    if (snapshot.exists()) {
        const queueListData = snapshot.val().queueList
        if (queueListData === '') {
            clearContainer();
            
            Notiflix.Notify.failure(`Opps🙊 your library is empty!`,{
                timeout: 2000,
            });
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

              Notiflix.Notify.failure(`Opps🙊 your library is empty!`, {
                timeout: 2000,
              });
            } else {
              const queueList = JSON.parse(snapshot.val().queueList);
              console.log(queueList);
              renderMurkUpLibrary(queueList);
              console.log(queueList);
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

const checkMovieInQueueList = async (resp) =>{

  const data = resp.data;
  const idMovie = data.id;

  // if (homeActive.dataset.active === 'true') {
  //     return;
  //   };

    get(child(dbRef, `users/${userId}`)).then((snapshot) => {
    
      if (snapshot.exists()) {
        const rawListQueue = snapshot.val().queueList;
        const queueList = rawListQueue && JSON.parse(rawListQueue)  || [];
         
        const isAdded = queueList.some(obj => obj.id === idMovie);
          
          createFilmDetailsMarkup(resp, isAdded);  
       } else {
      console.log("No data available");
  }
})
.catch(error => {
console.error(error);
});
  

}

export { onClickBtnToQueue, checkMovieInQueueList, onRemoveQueueBtnClick };

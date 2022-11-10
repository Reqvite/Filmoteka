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

const auth = getAuth();
export const user = auth.currentUser;
const USER_LOGIN_KEY = 'userIsLogin';
// const db = getDatabase();
// const dbRef = ref(getDatabase());
// let genreCollection = {};
// fetchGenreId()
//   .then(genreId => {
//     genreId.data.genres.forEach(function (genre) {
//       genreCollection[genre.id] = genre.name;
//     });
//   })
//   .catch(error => console.log(error));

//------------------------add to queue---------------

const onClickBtnToQueue = (data, e) => {

  const queueAddBtn = document.querySelector('.queue-add');
  queueAddBtn.textContent = 'REMOVE FROME QUEUE';

  queueAddBtn.classList.add('remove-from-queue');
  queueAddBtn.classList.remove('queue-add');

  closeModal();
 

  const idMovie = data.id;

  /*-------перевіряю чи залогінився юзер ------------*/
  const userIsLogin = JSON.parse(localStorage.getItem(USER_LOGIN_KEY));

  if (userIsLogin) {
    onAuthStateChanged(auth, user => {
      
      const dbRef = ref(getDatabase());
      const uid = user.uid;

      if (user) {
        get(child(dbRef, `users/${uid}`))
          .then(snapshot => {
            if (snapshot.exists()) {
              const queueDataString = snapshot.val().queueList;
              if (queueDataString === '') {
                let listWatchedArr = [];
                listWatchedArr.push(data);

                const queueListString = JSON.stringify(listWatchedArr);

                update(ref(database, 'users/' + uid), {
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

                  update(ref(database, 'users/' + uid), {
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
      }
    });
  } else {
    Notiflix.Notify.failure(`please log in`, {
      timeout: 2000,
    });
    return;
  }
};

//----------------click remove from queue bbtn-------------

const onRemoveQueueBtnClick = (data, e) => {

  const idMovie = data.id;
  
  const removeFromQueueBtn = document.querySelector('.remove-from-queue');
  removeFromQueueBtn.textContent = 'ADD TO QUEUE';
  removeFromQueueBtn.classList.add('queue-add');
  removeFromQueueBtn.classList.remove('remove-from-queue');

  closeModal();


  onAuthStateChanged(auth, (user) => {

    if (user) {
        const uid = user.uid; 
        const dbRef = ref(getDatabase());

        get(child(dbRef, `users/${uid}`)).then((snapshot) => {

            if (snapshot.exists()) {

                const queueListArr = JSON.parse(snapshot.val().queueList);

                const newQueueListArr = queueListArr.filter((obj, idx, arr) =>{
                    if (obj.id === idMovie) {
                        return false
                    };
                   return arr.push(obj)
                });
                
                if (newQueueListArr.length === 0) {
                    // clearContainer();
                    update(ref(database, 'users/' + uid),{
                        queueList: ''
                    }); 
                    return; 
                } 

               // renderMurkUpLibrary(newQueueListArr);

                const newQueueListString = JSON.stringify(newQueueListArr);
                update(ref(database, 'users/' + uid),{
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
  // ...
} else {
  // User is signed out
  // ...
}
});   

}





// ------------------click my library-------------
const homeActive = document.querySelector('.home-js')
      
const onMyLibararyClick = e => {
  if (e.target.name === 'library') {
       homeActive.setAttribute('data-active', false)
  };
  
    if (e.target.name !== 'library') {
      refs.listEl.classList.remove('is-hidden');
             homeActive.setAttribute('data-active', true)

        return; 
    };

    refs.listEl.classList.add('is-hidden');
  refs.watchedBtnInLibrary.classList.remove('header__mylibrary-btn--active');
  refs.queueBtnInLibrary.classList.add('header__mylibrary-btn--active');

  onAuthStateChanged(auth, (user) => {
      
      if (homeActive.dataset.active === 'true') {
        return;
      }
        if (user) {
            const uid = user.uid; 
            const dbRef = ref(getDatabase());
      
            get(child(dbRef, `users/${uid}`)).then((snapshot) => {
      
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
        })
        .catch(error => {
          console.error(error);
        });
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
};

refs.headerNavList.addEventListener('click', onMyLibararyClick);



const onQueueBtnClickinLibrary = e => {
  refs.watchedBtnInLibrary.classList.remove('header__mylibrary-btn--active');
  refs.queueBtnInLibrary.classList.add('header__mylibrary-btn--active');

  onAuthStateChanged(auth, user => {
    if (user) {
      const uid = user.uid;
      const dbRef = ref(getDatabase());

      get(child(dbRef, `users/${uid}`))
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
        })
        .catch(error => {
          console.error(error);
        });
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
  if (
    refs.queueBtnInLibrary.classList.contains('header__mylibrary-btn--active')
  ) {
    return;
  }
};

refs.queueBtnInLibrary.addEventListener('click', onQueueBtnClickinLibrary);








// ---------перевтряю --------
// export async function AuthState(user) {
//   return await onAuthStateChanged(auth, user => {
//     if (user) {
//       return user.uid;
//       //return sessionStorage.setItem('userId', `${userId}`);
//     } else {
//       return;
//     }
//   });
// }

// const getUser = async() => {
//   await onAuthStateChanged(auth, (user) => {
//     console.log('onAuthStateChanged');
 
      
//     // if (homeActive.dataset.active === 'true') {
//     //   return;
//     // }
//       if (user) {
//           const uid = user.uid; 
//           const snapshot = await get(child(dbRef, `users/${uid}`))
//       }
// }

//  const getQueueList = async (userId) => {
//   return await get(child(dbRef, 'users/' + userId))
//     .then(snapshot => {
//       if (snapshot.exists()) {
//         return JSON.parse(snapshot.val().queueList);
//         //return snapshot.val();
//       } else {
//         return null;
//       }
//     })
//     .catch(() => renderErrorServer());
//   // let arr = [];
//   // for (let key in value) {
//   //   arr.push(JSON.parse(value[key]).objService);
//   // }
//   // return arr;
// }

const renderModal = async (resp) =>{

  const data = resp.data;
  const idMovie = data.id;

  // const a = await getAuthState();
  // console.log(a);
  //const userId = await authState(user);

  // console.log({user});
  // console.log({userId});

  //const list = await getQueueList(userId);
  //console.log({list});
  await onAuthStateChanged(auth, (user) => {

      
    // if (homeActive.dataset.active === 'true') {
    //   return;
    // }
      if (user) {
          const uid = user.uid; 
          const dbRef = ref(getDatabase());

        //const snapshot =  get(child(dbRef, `users/${uid}`))
    
          get(child(dbRef, `users/${uid}`)).then((snapshot) => {
    
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
    // ...
  } else {
    // User is signed out
    // ...
  }
});
  

}

export { onClickBtnToQueue, renderModal, onRemoveQueueBtnClick };

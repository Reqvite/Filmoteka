import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, enableLogging, update,child, get, onDisconnect} from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";


import { switchToHome } from './changeHeaderPageHome-Mylibrary'; 
import { fetchTrendingFilms } from './collection';
import { refs } from '../refs/refs';


const firebaseConfig = {
  apiKey: 'AIzaSyAmrcw3LWh5vdrPE40gh2Uggxq3EG96Lys',
  authDomain: 'film-library-registration.firebaseapp.com',
  databaseURL:
    'https://film-library-registration-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'film-library-registration',
  storageBucket: 'film-library-registration.appspot.com',
  messagingSenderId: '394290136676',
  appId: '1:394290136676:web:9848416d6de87eb2614171',
};

const list = document.querySelector('.container-films') 
function listAnimation() {
  setTimeout(() => {
    list.style.top = '0'
    list.style.opacity ='1'
  },150)
}
listAnimation()

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
const auth = getAuth();
const user = auth.currentUser;
const dt = new Date();


//modal open-close
const modal = document.querySelector('.backdrop-form');
const modalFormBtnClose = document.querySelector('.modal-form-btn');

//form changes
const nameInput = document.querySelector('.name-input');
const formRegistr = document.querySelector('.registr');
const formTitle = document.querySelector('.form-title');

const myLibraryJs = document.querySelector('.my-library-js');


//Проверка залогинен пользователь или нет
function userIsLogin() {
  const userIsLogin = localStorage.getItem('userIsLogin');
  const userIsLoginParse = JSON.parse(userIsLogin);

  if (userIsLoginParse) {
    refs.signinBtn.style.display = 'none';
    refs.loginBtn.style.display = 'none';
    myLibraryJs.style.display = 'block';
    refs.logOut.style.display = 'block';
  } else {
    myLibraryJs.style.display = 'none';
    refs.logOut.style.display = 'none';
  }
}

userIsLogin();

function closeFormModal() {
  modal.classList.add('form-hidden');
  formRegistr.removeEventListener('submit', signUpUser);
  formRegistr.removeEventListener('submit', logInUser);
  refs.submitSignBtn.style.display = 'none';
  refs.submitLoginBtn.style.display = 'none';
  document.removeEventListener('keydown', escModal);
  modal.removeEventListener('click', closeModalOutsideWindow);
  refs.body.style.overflow = 'scroll';
}

modalFormBtnClose.addEventListener('click', closeFormModal);

function escModal(e) {
  if (e.code === 'Escape') {
    closeFormModal();
  }
}

function closeModalOutsideWindow(e) {
  if (!e.target.classList.contains('backdrop-form')) {
    return;
  }
  closeFormModal();
}

//Открытие модалки(регистрация)
refs.signinBtn.addEventListener('click', e => {
  modal.classList.remove('form-hidden');
  nameInput.style.display = 'block';
  formRegistr.addEventListener('submit', signUpUser);
  refs.submitSignBtn.style.display = 'block';
  formTitle.textContent = 'SIGN IN TO FILMOTEKA';
  refs.body.style.overflow = 'hidden';
  document.addEventListener('keydown', escModal);
  modal.addEventListener('click', closeModalOutsideWindow);
});

//Регистрация пользователя
function signUpUser(e) {
  e.preventDefault();
  const username = formRegistr.elements[0].value;
  const email = formRegistr.elements[1].value;
  const password = formRegistr.elements[2].value;

  modal.classList.add('form-hidden');
  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      set(ref(database, 'users/' + user.uid), {
        username: username,
        queueList: '',
        watchedList: '',
        email: email,
        last_login: dt,
      });
      handleLogIn();
      removeEventListeners();
      Notify.success(
        'Congratulations, your account has been successfully created.',
        {
          timeout: 1000,
        }
      );
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      removeEventListeners();

      Notify.failure(errorMessage, {
        timeout: 2000,
      });
    });
  e.target.reset();
}

//Открытие модалки(логин)

refs.loginBtn.addEventListener('click', e => {
  formRegistr.addEventListener('submit', logInUser);
  formTitle.textContent = 'LOG IN TO FILMOTEKA';
  modal.classList.remove('form-hidden');
  nameInput.style.display = 'none';
  refs.submitSignBtn.style.display = 'none';
  refs.submitLoginBtn.style.display = 'block';
  refs.body.style.overflow = 'hidden';
  document.addEventListener('keydown', escModal);
  modal.addEventListener('click', closeModalOutsideWindow);
});

//Логинизация
function logInUser(e) {
  e.preventDefault();

  const username = formRegistr.elements[0].value;
  const email = formRegistr.elements[1].value;
  const password = formRegistr.elements[2].value;

  localStorage.setItem('userId', '');

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      const uid = user.uid;

      localStorage.setItem('userId', uid);

      update(ref(database, 'users/' + user.uid), {
        last_login: dt,
      });
      handleLogIn();
      removeEventListeners();
      const dbRef = ref(getDatabase());
      get(child(dbRef, `users/${uid}`))
        .then(snapshot => {
          if (snapshot.exists()) {
            Notify.success(
              `Hi, ${
                snapshot.val().username || 'Anonymus'
              }, you are logged in successfully.`,
              {
                timeout: 1000,
              }
            );
          } else {
            console.log('No data available');
          }
        })
        .catch(error => {
          removeEventListeners();
          console.error(error);
        });
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      formRegistr.removeEventListener('submit', signUpUser);
      Notify.failure(errorMessage, {
        timeout: 2000,
      });
    });
}

function handleLogIn() {
  modal.classList.add('form-hidden');
  refs.signinBtn.style.display = 'none';
  refs.loginBtn.style.display = 'none';
  refs.logOut.style.display = 'block';
  myLibraryJs.style.display = 'block';
  refs.submitLoginBtn.style.display = 'none';
  localStorage.setItem('userIsLogin', 'true');
  refs.body.style.overflow = 'scroll';
}

//Получение данных если пользоваетль залогинен
// onAuthStateChanged(auth, user => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/firebase.User
//     const uid = user.uid;
//     const dbRef = ref(getDatabase());
//     localStorage.setItem('userId', uid);
//     get(child(dbRef, `users/${uid}`))
//       .then(snapshot => {
//         if (snapshot.exists()) {
//           console.log(snapshot.val());
//         } else {
//           console.log('No data available');
//         }
//       })
//       .catch(error => {
//         console.error(error);
//       });
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });

//Выйти из аккаунта
refs.logOut.addEventListener('click', e => {
     if (e.target.nodeName === 'LI' || e.target.nodeName === 'UL') {
    return
  }
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      refs.signinBtn.style.display = 'block';
      refs.loginBtn.style.display = 'block';
      refs.logOut.style.display = 'none';
      myLibraryJs.style.display = 'none';

      localStorage.setItem('userId', '');

      localStorage.setItem('userIsLogin', 'false');
      switchToHome(e);
      fetchTrendingFilms();
      Notify.success('Successful logged out.', {
        timeout: 1000,
      });
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Notify.failure(errorMessage, {
        timeout: 2000,
      });
    });
});

function removeEventListeners() {
  formRegistr.removeEventListener('submit', signUpUser);
  formRegistr.removeEventListener('submit', logInUser);
}


document.addEventListener('click', checkConection)

function checkConection(){
 if (!navigator.onLine) {
   refs.sectionMain.outerHTML = '<p class="error-title">Check your connection and please reload the page.<p>';
   refs.errorImg.style.display = 'block';
  }
}

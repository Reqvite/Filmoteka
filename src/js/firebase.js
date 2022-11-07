import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, enableLogging, update,child, get } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAmrcw3LWh5vdrPE40gh2Uggxq3EG96Lys",
  authDomain: "film-library-registration.firebaseapp.com",
  databaseURL: "https://film-library-registration-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "film-library-registration",
  storageBucket: "film-library-registration.appspot.com",
  messagingSenderId: "394290136676",
  appId: "1:394290136676:web:9848416d6de87eb2614171"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
const auth = getAuth();
const user = auth.currentUser;

  
//Modal btns
const signinBtn = document.querySelector('.signin-Btn');
const loginBtn = document.querySelector('.login-Btn');

//submit btns
const logOut = document.querySelector('.login-Out');
const submitSignBtn = document.querySelector('.submit-signUp-btn');
const submitLoginBtn = document.querySelector('.submit-login-btn');

//modal open-close
const modal = document.querySelector('.backdrop-form');
const modalFormBtnClose = document.querySelector('.modal-form-btn');

//form changes
const nameInput = document.querySelector('.name-input');
const formRegistr = document.querySelector('.registr')


const myLibraryJs = document.querySelector('.my-library-js');
myLibraryJs.style.display = 'none'
logOut.style.display = 'none'

//Проверка залогинен пользователь или нет
function userIsLogin(){
    const userIsLogin = localStorage.getItem("userIsLogin");
    const userIsLoginParse = JSON.parse(userIsLogin);

  if (userIsLoginParse) {
    signinBtn.style.display = 'none';
    loginBtn.style.display = 'none';
    myLibraryJs.style.display = 'block';
    logOut.style.display = 'block';
  }
}

userIsLogin()

// Закрытие модалки
modalFormBtnClose.addEventListener('click', e => {
    modal.classList.add('form-hidden');
    formRegistr.removeEventListener('submit', signUpUser);
    formRegistr.removeEventListener('submit', logInUser); 
    submitSignBtn.style.display = 'none';
    submitLoginBtn.style.display = 'none';
})

//Открытие модалки(регистрация)
signinBtn.addEventListener('click', e => {
  modal.classList.remove('form-hidden');
      nameInput.style.display = 'block';
    formRegistr.addEventListener('submit', signUpUser) 
    submitSignBtn.style.display = 'block';
})

//Регистрация пользователя
function signUpUser(e) {
     e.preventDefault()
    const username = formRegistr.elements[0].value
    const email = formRegistr.elements[1].value
    const password = formRegistr.elements[2].value

    modal.classList.add('form-hidden');
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
          const dt = new Date();
          
            set(ref(database, 'users/' + user.uid), {
                username: username,
                queueList:'',
              email: email,
                last_login: dt,
            })

            modal.classList.add('form-hidden');
            signinBtn.style.display = 'none';
            loginBtn.style.display = 'none';
            logOut.style.display = 'block'
            myLibraryJs.style.display = 'block';
            submitSignBtn.style.display = 'none';
            formRegistr.removeEventListener('submit', signUpUser);

            localStorage.setItem("userIsLogin", "true");
            Notify.success('Congratulations, your account has been successfully created.');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
             formRegistr.removeEventListener('submit', signUpUser);
         
          Notify.failure(errorMessage);
        })
        e.target.reset()
}

//Открытие модалки(логин)
loginBtn.addEventListener('click', e => {
    modal.classList.remove('form-hidden');
    nameInput.style.display = 'none';
    submitSignBtn.style.display = 'none';
    submitLoginBtn.style.display = 'block';
    formRegistr.addEventListener('submit', logInUser); 
})

//Логинизация
function logInUser(e) {
    e.preventDefault()
  const username = formRegistr.elements[0].value 
    const email = formRegistr.elements[1].value
    const password = formRegistr.elements[2].value

  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    const uid = user.uid;   
       const dt = new Date();
         update(ref(database, 'users/' + user.uid),{
             last_login: dt,
             localData: 'data'
         })
            modal.classList.add('form-hidden');
            signinBtn.style.display = 'none';
      loginBtn.style.display = 'none';
      logOut.style.display = 'block';
      myLibraryJs.style.display = 'block';
      submitLoginBtn.style.display = 'none';

      localStorage.setItem("userIsLogin", "true");
    formRegistr.removeEventListener('submit', logInUser);
    
        const dbRef = ref(getDatabase());
get(child(dbRef, `users/${uid}`)).then((snapshot) => {
  if (snapshot.exists()) {
     Notify.success(`Hi, ${snapshot.val().username || 'Anonymus' }, you are logged in successfully.`);
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
    

  })
  .catch((error) => {
    const errorCode = error.code;
      const errorMessage = error.message;
    formRegistr.removeEventListener('submit', signUpUser);
      Notify.failure(errorMessage);
  });   
}

//Получение данных если пользоваетль залогинен
onAuthStateChanged(auth, (user) => {

  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid; 
      const dbRef = ref(getDatabase());

get(child(dbRef, `users/${uid}`)).then((snapshot) => {

  if (snapshot.exists()) {
    console.log(snapshot.val());

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


//Выйти из аккаунта
logOut.addEventListener('click', e => {
    signOut(auth).then(() => {
  // Sign-out successful.
           signinBtn.style.display = 'block';
            loginBtn.style.display = 'block';
        logOut.style.display = 'none'
      myLibraryJs.style.display = 'none';
      
        localStorage.setItem("userIsLogin", "false");
      Notify.success('Successful logged out.');
}).catch((error) => {
   const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
});
})



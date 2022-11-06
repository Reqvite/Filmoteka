// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, enableLogging, update,child, get } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// Your web app's Firebase configuration
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
const database = getDatabase(app);
const auth = getAuth();
const user = auth.currentUser;
  

const signinBtn = document.querySelector('.signin-Btn');
const loginBtn = document.querySelector('.login-Btn');
const logOut = document.querySelector('.login-Out');


const nameInput = document.querySelector('.name-input');
const submitSignBtn = document.querySelector('.submit-signUp-btn');
const submitLoginBtn = document.querySelector('.submit-login-btn');


const modal = document.querySelector('.backdrop-form');
const modalFormBtnClose = document.querySelector('.modal-form-btn');

const formRegistr = document.querySelector('.registr')


const myLibraryJs = document.querySelector('.my-library-js');
myLibraryJs.style.display = 'none'

//Проверка залогинен пользователь или нет
function userIsLogin(){
    const userIsLogin = localStorage.getItem("userIsLogin");
    const userIsLoginParse = JSON.parse(userIsLogin);

    if (userIsLoginParse) {
    signinBtn.style.display = 'none';
    loginBtn.style.display = 'none';
    myLibraryJs.style.display = 'block';
    logOut.classList.remove('is-hidden');
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
            // ...
            set(ref(database, 'users/' + user.uid), {
                username: username,
                email: email
            })

            modal.classList.add('form-hidden');
            signinBtn.style.display = 'none';
            loginBtn.style.display = 'none';
            logOut.classList.remove('is-hidden');
            myLibraryJs.style.display = 'block';
            submitSignBtn.style.display = 'none';
            formRegistr.removeEventListener('submit', signUpUser);

            localStorage.setItem("userIsLogin", "true");
            alert('created')
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
             formRegistr.removeEventListener('submit', signUpUser);
            alert(errorMessage)
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
    // ...
       const dt = new Date();
         update(ref(database, 'users/' + user.uid),{
             last_login: dt,
             localData: 'data'
         })
            modal.classList.add('form-hidden');
            signinBtn.style.display = 'none';
      loginBtn.style.display = 'none';
      logOut.classList.remove('is-hidden');
      myLibraryJs.style.display = 'block';
      submitLoginBtn.style.display = 'none';

      localStorage.setItem("userIsLogin", "true");
      formRegistr.removeEventListener('submit', logInUser);
      alert('login')
  })
  .catch((error) => {
    const errorCode = error.code;
      const errorMessage = error.message;
    formRegistr.removeEventListener('submit', signUpUser);
      alert(errorMessage)
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
        logOut.classList.add('is-hidden')
      myLibraryJs.style.display = 'none';
      
        localStorage.setItem("userIsLogin", "false");
    alert('sign out')
}).catch((error) => {
   const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
});
})






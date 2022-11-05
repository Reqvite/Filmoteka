// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, enableLogging, update  } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

const logInBtn = document.querySelector('.loginBtn')

const modal = document.querySelector('.backdrop-form');

console.log(modal)
logInBtn.addEventListener('click', e => {
    modal.classList.remove('form-hidden');
})

// Initialize Firebase
const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth();

const formRegistr = document.querySelector('.registr')

formRegistr.addEventListener('submit', e => {
    e.preventDefault()
    const username = formRegistr.elements[0].value
    const email = formRegistr.elements[1].value
    const password = formRegistr.elements[2].value

    e.target.reset()
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
            logInBtn.style.display = 'none'
            alert('created')
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
            alert(errorMessage)
        });
})

// const auth = getAuth();
// signInWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in 
//     const user = userCredential.user;
//     // ...
//        const dt = new Date();
//          update(ref(database, 'users/' + user.uid),{
//           last_login: dt,
//         })
//       alert('login')
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//       const errorMessage = error.message;
//       alert(errorMessage)
//   });
    
// })

const user = auth.currentUser;
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});


// signOut(auth).then(() => {
//   // Sign-out successful.
//     alert('sign out')
// }).catch((error) => {
//    const errorCode = error.code;
//       const errorMessage = error.message;
//       alert(errorMessage)
// });






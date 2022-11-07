import Notiflix from 'notiflix';
import fotoCardsTpl from "./markups/filmCardMarkup";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, child, push, update, get  } from "firebase/database";
import { database } from "./firebase";


const auth = getAuth();
const USER_LOGIN_KEY = 'userIsLogin';

const container = document.querySelector('.container-films')
const refs ={
    headerNavList: document.querySelector('.header__nav-list'),
};


//------------------------add to watched---------------


const onClickBtn = (data,e)=>{

    const idMovie = data.id
  
    if (e.target.name !== 'queue') {
        return;
        
    };
     // ----------перевіряю чи залогінився юзер ------------------
    const userIsLogin = JSON.parse(localStorage.getItem(USER_LOGIN_KEY));
    
    if (userIsLogin) {
        onAuthStateChanged(auth, (user) => {
            console.log(user);
            const dbRef = ref(getDatabase());
            const uid = user.uid; 


            if (user) {
                get(child(dbRef, `users/${uid}`)).then((snapshot) => {

                    if (snapshot.exists()) {
                        const queueDataString = snapshot.val().localData
                        if (queueDataString === 'data') {

                            let listWatchedArr = [];
                            listWatchedArr.push(data);

                            const queueListString = JSON.stringify(listWatchedArr);
                            console.log(queueListString);
                            update(ref(database, 'users/' + uid),{
                                localData: queueListString
                            });  
                        } else{
                            
                            const queueDataArr = JSON.parse(queueDataString);
                            console.log(queueDataArr);
                            
                            /*---- перевіряю  масив на однакові id і добавляю новий об'єкт-------*/
                            const checkArr = queueDataArr.some(obj => obj.id === idMovie);
                         
                            if (checkArr) {
                                Notiflix.Notify.info(`Тhis movie was add to the QUEUE`,{
                                    timeout: 2000,
                                });
                                
                            }else{

                                // ---------добавляю новий об'єк в масив і перезаписую data-------------
                                queueDataArr.push(data)
                                const queueListString = JSON.stringify(queueDataArr)

                                update(ref(database, 'users/' + uid),{
                                localData: queueListString
                                });

                                Notiflix.Notify.success(`Add movie`,{
                                    timeout: 2000,
                                });

                            };

                        };
                  
                    } else {
                      console.log("No data available");
                    }
                  }).catch((error) => {
                    console.error(error);
                });

                
            }});
    } else{
        Notiflix.Notify.failure(`please log in`,{
            timeout: 2000,
        });
        return;
    };



        

        //-------перевіряю чи є в listWatchedArr фільм з id 
        //const checkingListWatchedArr = listWatchedArr.some(obj => obj.id === idMovie);
        //listWatchedArr.map(obj => obj.id).includes(idMovie) // інший спосіб

        // if (checkingListWatchedArr) {
        //     Notiflix.Notify.info(`Тhis movie was add to the QUEUE`,{
        //         timeout: 2000,
        //     });
        //     return; 
        // };

        
        // const qqq = JSON.stringify(listWatchedArr)
        // console.log(qqq);
        

      
        //-----------------------------
        


        
    

    

        //---- перевіряю LocalStorage і добавляю новий об'єкт-------
    // const moviesListLocalStorage = JSON.parse(localStorage.getItem(WATCHED_KYE));

    // if (moviesListLocalStorage !== null) {
        
    //    const checkingListWatchedArr =  moviesListLocalStorage.some(obj => obj.id === idMovie);
       
    //    if (checkingListWatchedArr) {
    //     Notiflix.Notify.info(`Тhis movie has already been added to the QUEUE`,{
    //         timeout: 2000,
    //     });
    //     return;
        
    //     }else{

    //     moviesListLocalStorage.push(data);
    //     localStorage.setItem(WATCHED_KYE, JSON.stringify(moviesListLocalStorage));
    //     Notiflix.Notify.success(`Add movie`,{
    //         timeout: 2000,
    //     });
    //     };
    //     return;
    // };
        
              //----- add obj in localStorage -------// 
    
    // localStorage.setItem(WATCHED_KYE,JSON.stringify(listWatchedArr));


};




// ------------------click my library-------------

const onMyLibararyClick = e =>{

    if ( e.target.name !=='library') {
        return; 
    };


    onAuthStateChanged(auth, (user) => {

        if (user) {
            const uid = user.uid; 
            const dbRef = ref(getDatabase());
      
            get(child(dbRef, `users/${uid}`)).then((snapshot) => {
      
                if (snapshot.exists()) {
                    const queueList = JSON.parse(snapshot.val().localData)
                    console.log(queueList);
                   
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



   const moviesListLocalStorage= JSON.parse(localStorage.getItem(WATCHED_KYE));
   if (moviesListLocalStorage === null) {
    Notiflix.Notify.failure(`my library is emty`,{
        timeout: 2000,
    });
    return;
   }
   const renderLibrary = fotoCardsTpl(moviesListLocalStorage);
   container.innerHTML = renderLibrary;

};



refs.headerNavList.addEventListener('click',onMyLibararyClick);



export{ onClickBtn };
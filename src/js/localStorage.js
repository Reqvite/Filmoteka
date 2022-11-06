import Notiflix from 'notiflix';
import fotoCardsTpl from "./markups/filmCardMarkup";
let userData;

function getUserData(data) {
    userData = data
}


const WATCHED_KYE = 'queue';
const USER_LOGIN_KEY = 'userIsLogin';
const container = document.querySelector('.container-films')
const refs ={
    headerNavList: document.querySelector('.header__nav-list'),
};


//------------------------add to watched---------------

let listWatchedArr = [];
const onClickBtn = (data,e)=>{
    
    const idMovie = data.id
  
    if (e.target.name !== 'queue') {
        return;
        
    };

    const userIsLogin = JSON.parse(localStorage.getItem(USER_LOGIN_KEY));
    if (userIsLogin) {
        
        
        
    } else{
        Notiflix.Notify.failure(`please log in`,{
            timeout: 2000,
        });
        return;
    }
  

        //-------перевіряю чи є в listWatchedArr фільм з id 
    const checkingListWatchedArr = listWatchedArr.some(obj => obj.id === idMovie);
        //listWatchedArr.map(obj => obj.id).includes(idMovie) // інший спосіб
    
        if (checkingListWatchedArr) {
            Notiflix.Notify.info(`Тhis movie has already been added to the QUEUE`,{
                timeout: 2000,
            });
        return; 
    };

    

        //---- перевіряю LocalStorage і добавляю новий об'єкт-------
    const moviesListLocalStorage = JSON.parse(localStorage.getItem(WATCHED_KYE));

    if (moviesListLocalStorage !== null) {
        
       const checkingListWatchedArr =  moviesListLocalStorage.some(obj => obj.id === idMovie);
       
       if (checkingListWatchedArr) {
        Notiflix.Notify.info(`Тhis movie has already been added to the QUEUE`,{
            timeout: 2000,
        });
        return;
        
        }else{

        moviesListLocalStorage.push(data);
        localStorage.setItem(WATCHED_KYE, JSON.stringify(moviesListLocalStorage));
        Notiflix.Notify.success(`Add movie`,{
            timeout: 2000,
        });
        };
        return;
    };
        
              //----- add obj in localStorage -------// 
    listWatchedArr.push(data);
    localStorage.setItem(WATCHED_KYE,JSON.stringify(listWatchedArr))

    Notiflix.Notify.success(`Add movie`,{
        timeout: 2000,
    });

};


// ------------------click my library-------------

const onMyLibararyClick = e =>{

    console.log(userData);

    if ( e.target.name !=='library') {
        return; 
    };

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



export{onClickBtn, getUserData};
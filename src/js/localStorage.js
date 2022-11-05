import Notiflix from 'notiflix';
import fotoCardsTpl from "./markups/filmCardMarkup";

const WATCHED_KYE = 'add-to-watched';
const container = document.querySelector('.container-films')
const refs ={
    headerNavList: document.querySelector('.header__nav-list'),
};


//------------------------add to watched---------------

let listWatchedArr = [];
const onClickBtn = (data,e)=>{
    
    const idMovie = data.id
  
    if (e.target.name !== 'watched') {
        return;
        
    };
  

        //-------перевіряю чи є в listWatchedArr фільм з id 
    const checkingListWatchedArr = listWatchedArr.some(obj => obj.id === idMovie);
        //listWatchedArr.map(obj => obj.id).includes(idMovie) // інший спосіб
    
        if (checkingListWatchedArr) {
        return; 
    };


        //---- перевіряю LocalStorage і добавляю новий об'єкт-------
    const moviesListLocalStorage = JSON.parse(localStorage.getItem(WATCHED_KYE));

    if (moviesListLocalStorage !== null) {
        
       const checkingListWatchedArr =  moviesListLocalStorage.some(obj => obj.id === idMovie);
       
       if (checkingListWatchedArr) {
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

const onMyLibararyClick = e =>{

    if ( e.target.name !=='library') {
        return; 
    };

   const moviesListLocalStorage= JSON.parse(localStorage.getItem(WATCHED_KYE));
   if (moviesListLocalStorage === null) {
    Notiflix.Notify.success(`emty`,{
        timeout: 2000,
    });
    return;
   }
   const qqq = fotoCardsTpl(moviesListLocalStorage);
   container.innerHTML = qqq

};

refs.headerNavList.addEventListener('click',onMyLibararyClick);




export{onClickBtn};
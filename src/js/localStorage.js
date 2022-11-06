import Notiflix from 'notiflix';
import { renderMarkUp } from './collectionRender';
// import fotoCardsTpl from "./markups/filmCardMarkup";

const WATCHED_KYE = 'queue';
const container = document.querySelector('.container-films')
const refs ={
    headerNavList: document.querySelector('.header__nav-list'),
};

let genreCollection = {};
fetchGenreId()
  .then(genreId => {
    genreId.data.genres.forEach(function (genre) {
      genreCollection[genre.id] = genre.name;
    });
  })
  .catch(error => console.log(error));


//------------------------add to watched---------------

let listWatchedArr = [];
const onClickBtn = (data,e)=>{
    
    const idMovie = data.id
  
    if (e.target.name !== 'queue') {
        return;
        
    };
  

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
    // const renderLibrary = fotoCardsTpl(moviesListLocalStorage);
    const renderLibrary = renderMarkUp(moviesListLocalStorage, genreCollection);
   container.innerHTML = renderLibrary;

};

refs.headerNavList.addEventListener('click',onMyLibararyClick);



export{onClickBtn};
import './sass/index.scss';
import { fetchGenreId } from "./fetch";
import { fetchPopularMovies } from "./fetch";
import { renderMarkUp } from "./render";
import { renderPagination } from "./render";
// import Notiflix from 'notiflix';


let page = 1;
const collection = document.querySelector(`.collection`);
const pagination = document.querySelector(`.pagination`);

// console.log(collection);

let genreIdArr = [];
let genreCollection = {};

fetchGenreId()
  .then(genreId => {
    genreId.data.genres.forEach(function (genre) {
      genreCollection[genre.id] = genre.name
    })
    console.log(genreCollection); 
  })
  .catch(error => console.log(error));


function fetchMovies(page) {
  fetchPopularMovies(page).then(response => {
    console.log(response.data.results);
  const render = renderMarkUp(response.data.results, genreCollection);
  const renderedPagination = renderPagination(Number(response.data.page), Number(response.data.total_pages))
    collection.innerHTML = render;
    pagination.innerHTML = renderedPagination;

})

}


pagination.addEventListener("click", (e) => {
  e.preventDefault()
  console.log(e.target);
  console.log(e.target.dataset.page);
  fetchMovies(e.target.dataset.page)
})

fetchMovies(1)




import './js/modal-footer';

import './js/addFilmsAndrenderGalery'


import './js/service';

import './js/markups/filmDetailMarkup';

import './js/openFilmModal'
import './js/toggleTheme';

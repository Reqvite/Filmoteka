import { fetchGenreId } from "./collectionFetch";
import { fetchPopularMovies } from "./collectionFetch";
import { renderMarkUp } from "./collectionRender";
import { renderPagination } from "./collectionRender";


let page = 1;
const collection = document.querySelector(`.collection`);
const pagination = document.querySelector(`.pagination`);

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
  // const renderedPagination = renderPagination(Number(response.data.page), Number(response.data.total_pages))
    collection.innerHTML = render;
    // pagination.innerHTML = renderedPagination;

})

}

// pagination by VladLysenko
// pagination.addEventListener("click", (e) => {
//   e.preventDefault()
//   fetchMovies(e.target.dataset.page)
// })
fetchMovies(page)

const homeBtn = document.querySelector('.home-js');
const myLibraryBtn = document.querySelector('.my-library-js');
const sectionHeader = document.querySelector('.header__section');
const form = document.querySelector('.header__search-form');
const libraryButtons = document.querySelector('.header__mylibrary');

myLibraryBtn.addEventListener('click', changeToMylibrary);
homeBtn.addEventListener('click', changeToHome);

function changeToMylibrary(e) {
  e.preventDefault();
  sectionHeader.classList.remove('header__section');
  form.style.display = 'none';
  libraryButtons.classList.remove('visually-hidden');
  sectionHeader.classList.add('header__section--mylibrary');
}
function changeToHome(e) {
  e.preventDefault();
  sectionHeader.classList.remove('header__section--mylibrary');
  libraryButtons.classList.add('visually-hidden');
  sectionHeader.classList.add('header__section');
  form.style.display = 'block';
}

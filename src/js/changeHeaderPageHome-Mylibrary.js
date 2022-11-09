const homeBtn = document.querySelector('.home-js');
const myLibraryBtn = document.querySelector('.my-library-js');
const sectionHeader = document.querySelector('.header__section');
const form = document.querySelector('.header__search-form');
const libraryButtons = document.querySelector('.header__mylibrary');
const logo = document.querySelector('.header__logo-link');

myLibraryBtn.addEventListener('click', switchToMylibrary);
homeBtn.addEventListener('click', switchToHome);

function switchToMylibrary(e) {
  e.preventDefault();
  sectionHeader.classList.remove('header__section');
  form.style.display = 'none';
  libraryButtons.style.display = 'flex';
  sectionHeader.classList.add('header__section--mylibrary');
}

function switchToHome(e) {
  e.preventDefault();
  sectionHeader.classList.remove('header__section--mylibrary');
  libraryButtons.style.display = 'none';
  sectionHeader.classList.add('header__section');
  form.style.display = 'block';
}

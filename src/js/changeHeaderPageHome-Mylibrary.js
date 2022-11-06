const homeBtn = document.querySelector('.home-js');
const myLibraryBtn = document.querySelector('.my-library-js');
const sectionHeader = document.querySelector('.header__section');
const form = document.querySelector('.header__home-wrap');
const libraryButtons = document.querySelector('.header__mylibrary');

myLibraryBtn.addEventListener('click', switchToMylibrary);
homeBtn.addEventListener('click', switchToHome);

function switchToMylibrary(e) {
  e.preventDefault();
  sectionHeader.classList.remove('header__section');
  form.style.display = 'none';
  libraryButtons.classList.remove('visually-hidden');
  sectionHeader.classList.add('header__section--mylibrary');
}
function switchToHome(e) {
  e.preventDefault();
  sectionHeader.classList.remove('header__section--mylibrary');
  libraryButtons.classList.add('visually-hidden');
  sectionHeader.classList.add('header__section');
  form.style.display = 'block';
}

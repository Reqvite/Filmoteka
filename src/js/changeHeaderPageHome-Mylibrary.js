const homeBtn = document.querySelector('.home-js');
const myLibraryBtn = document.querySelector('.my-library-js');
const sectionHeader = document.querySelector('.header__section');
const form = document.querySelector('.header__search-form');
const libraryButtons = document.querySelector('.header__mylibrary');
const logo = document.querySelector('.header__logo-link');
const toggleTheme = document.querySelector('.toggle-theme');

myLibraryBtn.addEventListener('click', switchToMylibrary);
homeBtn.addEventListener('click', switchToHome);

function switchToMylibrary(e) {
  e.preventDefault();

  sectionHeader.classList.remove('header__section');
  form.style.display = 'none';
  libraryButtons.style.display = 'flex';
  sectionHeader.classList.add('header__section--mylibrary');
  toggleTheme.classList.replace('toggle-theme', 'toggle-theme-mylibrary');
}

 export function switchToHome(e) {
  e.preventDefault();
  sectionHeader.classList.remove('header__section--mylibrary');
  libraryButtons.style.display = 'none';
  sectionHeader.classList.add('header__section');
  form.style.display = 'block';
  toggleTheme.classList.replace('toggle-theme-mylibrary', 'toggle-theme');
}

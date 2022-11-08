import { fetchTrendingFilms } from './collection.js';
import { clearContainer } from './markups/renderMarkUpLibrary';
const homeBtn = document.querySelector('.home-js');
const myLibraryBtn = document.querySelector('.my-library-js');
const sectionHeader = document.querySelector('.header__section');
const form = document.querySelector('.header__search-form');
const libraryButtons = document.querySelector('.header__mylibrary');
const toggleTheme = document.querySelector('.toggle-theme');

// myLibraryBtn.addEventListener('click', switchToMylibrary);
homeBtn.addEventListener('click', switchToHome);

export function switchToHome(e) {
  clearContainer();
  fetchTrendingFilms();
  sectionHeader.classList.remove('header__section--mylibrary');
  libraryButtons.style.display = 'none';
  sectionHeader.classList.add('header__section');
  form.style.display = 'block';
  toggleTheme.classList.replace('toggle-theme-mylibrary', 'toggle-theme');
}

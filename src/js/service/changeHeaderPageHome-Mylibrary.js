import { fetchTrendingFilms } from './collection.js';
import { clearContainer } from '../markups/renderMarkUpLibrary';
import { refs } from '../refs/refs';

refs.myLibraryBtn.addEventListener('click', switchToMylibrary);
refs.homeBtn.addEventListener('click', switchToHome);

function switchToMylibrary(e) {
   if (e.target.nodeName === 'LI' || e.target.nodeName === 'UL') {
    return
  }
  refs.sectionHeader.classList.remove('header__section');
  refs.form.style.display = 'none';
  refs.libraryButtons.style.display = 'flex';
  refs.sectionHeader.classList.add('header__section--mylibrary');
  refs.homeButton.classList.remove('header__nav-button--current');
  refs.myLibraryButton.classList.add('header__nav-button--current');
  refs.toggleTheme.classList.replace('toggle-theme', 'toggle-theme-mylibrary');
}

export function switchToHome(e) {
   if (e.target.nodeName === 'LI' || e.target.nodeName === 'UL') {
    return
  }
  clearContainer();
  localStorage.setItem('currentPage', 1); // relaod trending start page from 1 page
  fetchTrendingFilms();
  refs.sectionHeader.classList.remove('header__section--mylibrary');
  refs.libraryButtons.style.display = 'none';
  refs.sectionHeader.classList.add('header__section');
  refs.form.style.display = 'block';
  refs.homeButton.classList.add('header__nav-button--current');
  refs.myLibraryButton.classList.remove('header__nav-button--current');
  refs.toggleTheme.classList.replace('toggle-theme-mylibrary', 'toggle-theme');
}

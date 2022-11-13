import { refs } from '../refs/refs';

window.addEventListener('scroll', () => {
  // определяем величину прокрутки
  const scrollY = window.scrollY || document.documentElement.scrollTop;
  // если страница прокручена больше чем на 400px, то делаем кнопку видимой, иначе скрываем
  let windowWidth = window.innerWidth;
  let scrollPoint = 0;

  scrollPoint = windowWidth <= 768 ? 3000 : 2000;

  scrollY > scrollPoint
    ? refs.btnUp.classList.remove('is-hiden')
    : refs.btnUp.classList.add('is-hiden');
});

refs.btnUp.addEventListener('click', onScrollUp);

function onScrollUp() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}

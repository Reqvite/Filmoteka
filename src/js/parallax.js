import { refs } from './refs/refs';
import * as image from '../images/felix-mooneeram-parallax.jpg';

export function addParallax(theme) {
  let parallaxImgContainer = document.querySelector('.parallax-img-container');

  if (!parallaxImgContainer) {
    const markupParallax = `<div class="parallax-img-container">
					<img class="parallax-img" src="${image}"  alt="cinema"/>
				</div>`;
    refs.wraper.insertAdjacentHTML('afterbegin', markupParallax);
    parallaxImgContainer = document.querySelector('.parallax-img-container');
  }

  if (theme === 'dark') {
    refs.wraper.classList.add('active');
    refs.content.classList.add('active');
    parallaxImgContainer.classList.remove('is-hidden');

    refs.body.addEventListener('click', setHeight);
    setHeight();
  }

  if (theme === 'white') {
    refs.wraper.classList.remove('active');
    refs.content.classList.remove('active');
    parallaxImgContainer.classList.add('is-hidden');

    refs.body.removeEventListener('click', setHeight);
  }
}

export function setHeight() {
  const timerId = setInterval(() => {
    const wraper = document.querySelector('.wraper');
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    const imgContainer = document.querySelector('.parallax-img-container');

    let wightContent = main.clientWidth;
    let heightContent =
      header.clientHeight + main.clientHeight + footer.clientHeight;
    heightContent = heightContent / (1.5 + (heightContent - 2000) / 6000);

    if (imgContainer) {
      imgContainer.style.height = `${heightContent}px`;
    }
  }, 20);

  setTimeout(() => {
    clearInterval(timerId);
  }, 5000);
}

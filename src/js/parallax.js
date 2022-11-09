import { refs } from './refs/refs';
import * as image from '../images/felix-mooneeram-parallax.jpg';

export function addParallax(theme) {
  let parallaxImg = document.querySelector('.parallax-img');

  if (!parallaxImg) {
    const markupParallax = `<div class="parallax-img">
					<img src="${image}"  alt="cinema"/>
				</div>`;
    refs.wraper.insertAdjacentHTML('afterbegin', markupParallax);
    parallaxImg = document.querySelector('.parallax-img');
  }

  if (theme === 'dark') {
    refs.wraper.classList.add('active');
    refs.content.classList.add('active');
    console.log(parallaxImg);
    parallaxImg.classList.remove('is-hidden');
  }

  if (theme === 'white') {
    refs.wraper.classList.remove('active');
    refs.content.classList.remove('active');
    console.log(parallaxImg);
    parallaxImg.classList.add('is-hidden');
  }
}

// import image from '../images/footer';

import * as image2 from '../../images/footer/Vladyslav-Yachyn.jpg';
import * as image1 from '../../images/footer/Yurii-Perekrestnyi.jpg';
import * as image3 from '../../images/footer/Alexander-Kulyk.jpg';
import * as image4 from '../../images/footer/me-foto-1.jpg';
import * as image5 from '../../images/footer/Taras-Novitskyi.jpg';
import * as image6 from '../../images/footer/Yevhenii-Kavetskyi.jpg';
import * as image7 from '../../images/footer/img20.jpg';
import * as image9 from '../../images/footer/Inna-Sikora.jpg';
import * as image8 from '../../images/footer/Lina-Fomenko.jpg';
import * as image10 from '../../images/footer/270.jpg';
import * as sprite from '../../images/sprite.svg';

(() => {
  const refs = {
    openModalBtn: document.querySelector('[data-modal-open]'),
    closeModalBtn: document.querySelector('[data-modal-close]'),
    backdrop: document.querySelector('.modal-footer'),
    modal: document.querySelector('[data-modal]'),
    body: document.querySelector('body'),
  };

  refs.openModalBtn.addEventListener('click', toggleModal);
  refs.closeModalBtn.addEventListener('click', toggleModal);
  refs.backdrop.addEventListener(`click`, onBackdropClick);

  function toggleModal(event) {
    event.preventDefault();
    refs.modal.classList.toggle('is-hidden');
    document.addEventListener('keydown', onEscPress);
    if (!refs.modal.classList.contains('is-hidden')) {
          refs.body.style.overflow = 'hidden';
    } else {
      refs.body.style.overflow = 'scroll';
    }
  }
  
  function onCloseModal() {
    refs.modal.classList.add(`is-hidden`);
  }
  function closeOnEscKey() {
    refs.modal.classList.add(`is-hidden`);
    document.removeEventListener('keydown', onEscPress);
  }
  function onBackdropClick(event) {
    if (event.currentTarget === event.target) {
      onCloseModal();
         refs.body.style.overflow = 'scroll';
    }
  }
  function onEscPress(event) {
    if (event.code === 'Escape') {
      closeOnEscKey();
         refs.body.style.overflow = 'scroll';
    }
  }
})();

  const cart = [
    {img: `${image1}`, h3: `Scrum Master Yurii Perekrestnyi`, a:`https://github.com/Jodlei`, href: `https://www.linkedin.com/in/yurii-perekrestnyi-998396256/`},
    {img: `${image2}`, h3: `Team Lead Vladyslav Yachyn`, a:`https://github.com/Reqvite`, href: `https://uk.linkedin.com/`},
    {img: `${image3}`, h3: `Alexander Kulyk`, a:`https://github.com/alexander-kulyk`, href: `https://uk.linkedin.com/`},
    {img: `${image4}`, h3: `Daria Viunyk`, a:`https://github.com/Darya-Viunyk`, href: `https://www.linkedin.com/in/darya-viunyk-50b386181/`},
    {img: `${image5}`, h3: `Taras Novitskyi`, a:`https://github.com/Taras-Novitskyi`, href: `https://uk.linkedin.com/`},
    { img: `${image6}`, h3: `Yevhenii Kavetskyi`, a: `https://github.com/eugeniusz57`, href: `https://www.linkedin.com/in/yevhenii-kavetskyi-423a34250/` },
    { img: `${image7}`, h3: `Sergii Samara`, a: `https://github.com/SerhiiSamara`, href: `https://www.linkedin.com/in/serhii-samara-73a0397a/` },
    { img: `${image8}`, h3: `Lina Fomenko`, a: `https://github.com/linafv`, href: `https://uk.linkedin.com/` },
    { img: `${image9}`, h3: `Inna Sikora`, a: `https://github.com/Inna2794`, href: `https://uk.linkedin.com/` },
    { img: `${image10}`, h3: `Vladyslav Lysenko`, a: `https://github.com/VladyslavLysenko?tab=repositories`, href: `https://uk.linkedin.com/` }, 
  ];
  // DFilmoteka\src\images\sprite.svg:\archive\Goit\js\
  const paletteCarts = document.querySelector(`.js-palette`);
  const createCarts = createCart(cart);
  paletteCarts.insertAdjacentHTML(`afterbegin`, createCarts);
  function createCart(cart){
    return cart.map(({img, h3, a, href}) =>{
      return `
      <li class="team-footer__card">
      <img
        class="team-footer__foto"
        src="${img}"
        alt="foto"
      />
      <div class="about-footer">
        <h3 class="footer-text__big">${h3}</h3>
        <p lang="en" class="footer-text__smol">Frontend Developer</p>
        <ul class="networks-footer list">
          <li class="networks-footer__list">
            <a href="${a}" class="networks-footer__link">
              <svg class="networks-footer__icon" width="20" height="20">
                <use href="${sprite}#icon-git-icon"></use>
              </svg>
            </a>
          </li>
          <li class="networks-footer__list">
            <a href="${href}" class="networks-footer__link">
              <svg class="networks-footer__icon" width="20" height="20">
                <use href="${sprite}#icon-link-icon"></use>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </li>`;
    })
    .join('');
}

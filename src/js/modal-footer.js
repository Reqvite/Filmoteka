// import image from '../images/footer';
import * as image from '../images/footer/me-foto-1.jpg';
import * as sprite from '../images/sprite.svg';

(() => {
    const refs = {
      openModalBtn: document.querySelector("[data-modal-open]"),
      closeModalBtn: document.querySelector("[data-modal-close]"),
      backdrop: document.querySelector(".modal-footer"),
      modal: document.querySelector("[data-modal]"),
    };

    refs.openModalBtn.addEventListener("click", toggleModal);
    refs.closeModalBtn.addEventListener("click", toggleModal);
    refs.backdrop.addEventListener(`click`, onBackdropClick);

    function toggleModal(event){
      event.preventDefault();
      refs.modal.classList.toggle("is-hidden");

    }
    function onCloseModal(){
      refs.modal.classList.add(`is-hidden`);
    }
    function onBackdropClick(event){
      if(event.currentTarget === event.target){
        onCloseModal();
      }
    }
  })();
  //////// cart////////

  const cart = [
    {img: `${image}`, h3: `Viunyk Daria`, a:`https://github.com/Darya-Viunyk`, href: `https://www.linkedin.com/in/darya-viunyk-50b386181/`},
    {img: `${image}`, h3: `Viunyk Daria`, a:`https://github.com/Darya-Viunyk`, href: `https://www.linkedin.com/in/darya-viunyk-50b386181/`},
    {img: `${image}`, h3: `Viunyk Daria`, a:`https://github.com/Darya-Viunyk`, href: `https://www.linkedin.com/in/darya-viunyk-50b386181/`},
    {img: `${image}`, h3: `Viunyk Daria`, a:`https://github.com/Darya-Viunyk`, href: `https://www.linkedin.com/in/darya-viunyk-50b386181/`},
  ];
  // DFilmoteka\src\images\sprite.svg:\archive\Goit\js\
  const paletteCarts = document.querySelector(`.js-palette`);
  const createCarts = createCart(cart);
  paletteCarts.insertAdjacentHTML(`beforebegin`, createCarts);
  function createCart(cart){
    return cart.map(({img, h3, a, href}) =>{
      return `
      <li class="team__card">
      <img
        class="team__foto"
        src="${img}"
        alt="foto Viunyk Daria"
      />
      <div class="about">
        <h3 class="footer-text__big">${h3}</h3>
        <p lang="en" class="footer-text__smol">Frontend Developer</p>
        <ul class="networks list">
          <li class="networks__list">
            <a href="${a}" class="networks__link">
              <svg class="networks__icon" width="20" height="20">
                <use href="${sprite}#icon-git-icon"></use>
              </svg>
            </a>
          </li>
          <li class="networks__list">
            <a href="${href}" class="networks__link">
              <svg class="networks__icon" width="20" height="20">
                <use href="${sprite}#icon-git-icon"></use>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </li>`;
    })
    .join("");
  }
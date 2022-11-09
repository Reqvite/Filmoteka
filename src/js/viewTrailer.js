import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Notiflix from 'notiflix';
import fetchTrailerVideo from './fetchTrailerVideo';
import createTrailerMarkup from './markups/createTrailerMarkup';

export default async function viewTrailer(trailerId) {
  const btnViewTrailer = document.querySelector('.trailer-button--view');
  const btnCloseTrailer = document.querySelector('.trailer-button--close');
  const trailer = document.querySelector('.trailer');

  btnViewTrailer.addEventListener('click', onClickTrailerBtnView);
  btnCloseTrailer.addEventListener('click', onClickTrailerBtnClose);

  async function onClickTrailerBtnView() {
    try {
      const resp = await fetchTrailerVideo(trailerId);
      const { results } = resp.data;

      if (results.length === 0) {
        Notiflix.Notify.info('No trailer found!');
        return;
      }

      const keyVideo = results[0].key;
      trailer.classList.add('is-view');
      btnCloseTrailer.classList.remove('is-hidden');
      btnViewTrailer.classList.add('is-hidden');

      createTrailerMarkup(trailer, keyVideo);
    } catch (error) {
      Notiflix.Notify.info(error);
    }
  }

  async function onClickTrailerBtnClose() {
    try {
      trailer.classList.remove('is-view');
      trailer.innerHTML = '';
      btnCloseTrailer.classList.add('is-hidden');
      btnViewTrailer.classList.remove('is-hidden');
    } catch (error) {
      onError(error);
    }
  }
}

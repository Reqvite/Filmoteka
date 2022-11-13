import Notiflix from 'notiflix';
import fetchTrailerVideo from './fetchTrailerVideo';
import createTrailerMarkup from '../markups/createTrailerMarkup';

export default async function viewTrailer(trailerId) {
  const refs = {
    btnViewTrailer: document.querySelector('.trailer-button--view'),
    btnCloseTrailer: document.querySelector('.trailer-button--close'),
    trailer: document.querySelector('.trailer'),
  };

  refs.btnViewTrailer.addEventListener('click', onClickTrailerBtnView);
  refs.btnCloseTrailer.addEventListener('click', onClickTrailerBtnClose);

  async function onClickTrailerBtnView() {
    try {
      const resp = await fetchTrailerVideo(trailerId);
      const { results } = resp.data;

      if (results.length === 0) {
        Notiflix.Notify.info('Sorry, no trailer found!', {
      timeout: 1000,
    });
        return;
      }

      const keyVideo = results[0].key;
      refs.trailer.classList.add('is-view');
      refs.btnCloseTrailer.classList.remove('is-hidden');
      refs.btnViewTrailer.classList.add('is-hidden');

      createTrailerMarkup(refs.trailer, keyVideo);
    } catch (error) {
      Notiflix.Notify.failure(error.message);
    }
  }

  async function onClickTrailerBtnClose() {
    try {
      refs.trailer.classList.remove('is-view');
      refs.trailer.innerHTML = '';
      refs.btnCloseTrailer.classList.add('is-hidden');
      refs.btnViewTrailer.classList.remove('is-hidden');
    } catch (error) {
      Notiflix.Notify.failure(error.message);
    }
  }
}

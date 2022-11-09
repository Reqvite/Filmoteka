import fetchTrailerVideo from './fetchTrailerVideo';
import onError from './onError';
import createTrailerMarkup from './markups/createTrailerMarkup';

export default async function viewTrailer(trailerId) {
  const btnViewAndStopTrailer = document.querySelector('.trailer-button');
  const trailer = document.querySelector('.trailer');
  const insertBtn = btnViewAndStopTrailer.firstElementChild;

  btnViewAndStopTrailer.addEventListener('click', onClickTrailerBtn);

  async function onClickTrailerBtn(e) {
    try {
      let keyVideo;
      if (e.target.innerText === 'VIEW TRAILER') {
        const resp = await fetchTrailerVideo(trailerId);
        const { results } = resp.data;

        if (results.length === 0) {
          onError(' no trailer found!');
          return;
        }

        keyVideo = results[0].key;
        trailer.classList.add('is-view');

        createTrailerMarkup(trailer, keyVideo);

        e.target.innerText = 'CLOSE TRAILER';
        insertBtn.classList.remove('trailer-button__text--play');
        insertBtn.classList.add('trailer-button__text--stop');
        return;
      }

      if (e.target.innerText === 'CLOSE TRAILER') {
        trailer.classList.remove('is-view');
        e.target.innerText = 'VIEW TRAILER';
        insertBtn.classList.add('trailer-button__text--play');
        insertBtn.classList.remove('trailer-button__text--stop');
        trailer.innerHTML = '';
        return;
      }
    } catch (error) {
      onError(error);
    }
  }
}

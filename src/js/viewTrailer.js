import fetchTrailerVideo from './fetchTrailerVideo';

export default async function viewTrailer(trailerId) {
  const btnViewAndStopTrailer = document.querySelector('.trailer-button');
  const trailer = document.querySelector('.trailer');
  const insertBtn = btnViewAndStopTrailer.firstElementChild;

  btnViewAndStopTrailer.addEventListener('click', onClickViewAndStopTrailer);

  async function onClickViewAndStopTrailer(e) {
    let keyVideo;
    if (e.target.innerText === 'VIEW TRAILER') {
      await fetchTrailerVideo(trailerId)
        .then(resp => {
          const { results } = resp.data;
          keyVideo = results[0].key;
        })
        .catch(error => console.log(error));
      trailer.classList.add('is-view');
      trailer.insertAdjacentHTML(
        'beforeend',
        `<iframe
          class="trailer__vieo"
          src="https://www.youtube.com/embed/${keyVideo}?&autoplay=1"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowautoplay
          allowfullscreen
        ></iframe>`
      );
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
  }
}

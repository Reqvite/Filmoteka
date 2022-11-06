import fetchTrailerVideo from './fetchTrailerVideo';

export default async function viewTrailer() {
  const btnViewAndStopTrailer = document.querySelector('.trailer-button');
  const trailer = document.querySelector('.trailer');

  btnViewAndStopTrailer.addEventListener('click', onClickViewAndStopTrailer);

  async function onClickViewAndStopTrailer(e) {
    let keyVideo;
    if (e.target.innerText === 'View') {
      await fetchTrailerVideo().then(resp => {
        const { results } = resp.data;
        keyVideo = results[0].key;
      });
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
      e.target.innerText = 'Close';
      return;
    }

    if (e.target.innerText === 'Close') {
      trailer.classList.remove('is-view');
      e.target.innerText = 'View';
      trailer.innerHTML = '';
      return;
    }
  }
}

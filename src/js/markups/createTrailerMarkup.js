export default function createTrailerMarkup(element, key) {
  element.insertAdjacentHTML(
    'beforeend',
    `<iframe
          class="trailer__vieo"
          src="https://www.youtube.com/embed/${key}?&autoplay=1"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowautoplay
          allowfullscreen
        ></iframe>`
  );
}

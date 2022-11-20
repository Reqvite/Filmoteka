export default function renderSubFilterMarkup(items) {
  return items
    .map(item => {
      return `<li class="sub-filter__item list">
			<button class="sub-filter__link">${item}</button>
		</li>`;
    })
    .join('');
}

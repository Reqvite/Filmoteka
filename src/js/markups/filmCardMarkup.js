export default function fotoCardsTpl(data) {
	return data.map(({ poster_path, original_title, vote_average, genreNames, release_date, id }) => {
		return `<div class="collection__item" data-id="${id}">
		<div class="card">
			<img class="card-film__img" src="https://image.tmdb.org/t/p/original/${poster_path}" alt="${original_title}"/>

		<div class="card-wrap">
			<h2 class="card__title">${original_title}</h2>
			<div class="card__data">
			<p class="card-film__rating">${vote_average}</p>
			
			<p class="card__year">${release_date}</p>
			</div>
	</div>
  </div>
</div>`;
	}).join('')
}

// не хватает

{/* <p class="card__genre">${genreNames.join(", ")} |</p> */}
export default function fotoCardsTpl(data) {
	return data.map(({ poster_path, original_title, vote_average, genre_ids, release_date, id }) => {
		return `<div class="card-film" data-id="${id}">>
		<div class="card-film__container">
			<img class="card-film__img" src="https://image.tmdb.org/t/p/original/${poster_path}" alt="${original_title}"/>
		</div>
		<div class="card-film__details">
			<h2 class="card-film__title">${original_title}</h2>
			<p class="card-film__rating">${vote_average}</p>
			<p class="card-film__relize">${release_date}</p>
		</div>
		</div>`;
	}).join('')
}

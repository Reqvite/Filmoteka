import FilmsApiServer from './fimlsApiServer';
import filmCardsTpl from './markups/filmCardMarkup';
import { refs } from "./refs/refs";


const filmsApiServer = new FilmsApiServer();

export default function updateMarkupPagination(totalPages, page) {
  let itemEl = '';
  let activePages = '';
  let beforPages = page - 1;
  let afterPages = page + 1;

  if (page > 1) {
    itemEl += `<li class="pagination__arrow pagination__arrow-prev"><span>&#129128;</span></li>`;
  }

  if (page > 2) {
    itemEl += `<li class="pagination__numb-first"><span>1</span></li>`;

    if (page > 3) {
      itemEl += `<li class="pagination__dots"><span>&#183;&#183;&#183;</span></li>`;
    }
  }

  if (page === totalPages) {
    beforPages = beforPages - 2;
  } else if (page === totalPages - 1) {
    beforPages = beforPages - 1;
  }

  if (page === 1) {
    afterPages = afterPages + 2;
  } else if (page === 2) {
    afterPages = afterPages + 1;
  }
  for (let pageLength = beforPages; pageLength <= afterPages; pageLength += 1) {
    if (pageLength > totalPages || pageLength <= 0) {
      continue;
    }

    if (page === pageLength) {
      activePages = 'active';
    } else {
      activePages = '';
    }
    itemEl += `<li class="pagination__numb ${activePages}"><span>${pageLength}</span></li>`;
  }

  if (page < totalPages - 1) {
    if (page < totalPages - 2) {
      itemEl += `<li class="pagination__dots"><span>&#183;&#183;&#183;</span></li>`;
    }
    itemEl += `<li class="pagination__numb-last"><span>${totalPages}</span></li>`;
  }

  if (page < totalPages) {
    itemEl += `<li class="pagination__arrow pagination__arrow-next"><span>&#129130;</span></li>`;
  }

	refs.listEl.innerHTML = itemEl;

	const refsPagin = {
		prevEl: document.querySelector('.pagination__arrow-prev'),
		nextEl: document.querySelector('.pagination__arrow-next'),
		numbFirstEl: document.querySelector('.pagination__numb-first'),
		numbLastEl: document.querySelector('.pagination__numb-last'),
		numbEl: document.querySelectorAll('.pagination__numb'),
	}

  if (refsPagin.prevEl) {
    refsPagin.prevEl.addEventListener('click', async () => {
      filmsApiServer.decreasePage();
      updateMarkupPagination(totalPages, page - 1);
      addFilmsAndUpdateUI();
    });
  }

  if (refsPagin.nextEl) {
    refsPagin.nextEl.addEventListener('click', async () => {
      filmsApiServer.increasePage();
      updateMarkupPagination(totalPages, page + 1);
      addFilmsAndUpdateUI();
    });
  }
  if (refsPagin.numbFirstEl) {
    refsPagin.numbFirstEl.addEventListener('click', async () => {
      filmsApiServer.resetPage();
      updateMarkupPagination(totalPages, 1);
      addFilmsAndUpdateUI();
    });
  }

  if (refsPagin.numbLastEl) {
    refsPagin.numbLastEl.addEventListener('click', async () => {
      filmsApiServer.pagePagination = totalPages;
      updateMarkupPagination(totalPages, totalPages);
      addFilmsAndUpdateUI();
    });
  }

  for (
    let index = 0, pageLength = beforPages;
    pageLength <= afterPages;
    pageLength += 1
  ) {
    if (pageLength > totalPages || pageLength <= 0) {
      continue;
    }

    refsPagin.numbEl[index].addEventListener('click', async () => {
      filmsApiServer.pagePagination = pageLength;
      updateMarkupPagination(totalPages, pageLength);
      addFilmsAndUpdateUI();
    });

    index += 1;
  }
}


async function addFilmsAndUpdateUI() {
	try {
    refs.spinner.classList.remove('is-hiden');
		filmsApiServer.query = localStorage.getItem('query');
		const results = await filmsApiServer.fetchFilms();
    refs.spinner.classList.add('is-hiden');
		renderGalleryList(results);
	} catch (err) {
		onFetchError(err);
	}
}

function renderGalleryList(data) {
	const { results } = data;
	
	refs.gallery.innerHTML = filmCardsTpl(results); //filmCardsTpl(data) - функція яка рендерить HTML сторінку(робить хтось інший), results - масив обєктів
	document.querySelector('.header').scrollIntoView();
	clearSearchQuery();
}

function onFetchError(err) {
  console.log(err);
  clearGalleryContainer();
}

function clearGalleryContainer() {
  refs.gallery.innerHTML = '';
}

function clearSearchQuery() {
  refs.form.search.value = '';
}

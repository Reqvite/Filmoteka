import axios from 'axios';

const searchFilms = 'search';
const searchFilmsById = 'discover';
const BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = 'e145377b3a98d62607e7dc90339d279b';

export default class FilmsApiServer {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.primary_release_year = '';
    this.genreId = '';
    this.sort = '';
  }

  async fetchFilms() {
    const options = {
      params: {
        api_key: API_KEY,
        query: `${this.searchQuery}`,
        page: `${this.page}`,
        language: 'en-US',
      },
    };
    const { data } = await axios.get(
      `${BASE_URL}${searchFilms}/movie`,
      options
    );
    return data;
  }

  async fetchFilmsYear() {
    const options = {
      params: {
        api_key: API_KEY,
        page: `${this.page}`,
        primary_release_year: `${this.primary_release_year}`,
        language: 'en-US',
      },
    };
    const { data } = await axios.get(`${BASE_URL}`, options);
    return data;
  }

  async fetchFimsId() {
    const options = {
      params: {
        api_key: API_KEY,
        page: `${this.page}`,
        with_genres: `${this.genreId}`,
        language: 'en-US',
      },
    };
    const { data } = await axios.get(
      `${BASE_URL}${searchFilmsById}/movie`,
      options
    );
    return data;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get pagePagination() {
    return this.page;
  }

  set pagePagination(newPage) {
    this.page = newPage;
  }

  increasePage() {
    this.page += 1;
  }

  decreasePage() {
    this.page -= 1;
  }

  resetPage() {
    this.page = 1;
  }

  resetGenreId() {
    this.genreId = '';
  }
}

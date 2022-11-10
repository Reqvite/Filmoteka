import axios from 'axios';
const BASE_URL = 'https://api.themoviedb.org/3/movie/';
const API_KEY = 'e145377b3a98d62607e7dc90339d279b';

export default async function fetchTrailerVideo(id) {
  const options = {
    params: {
      api_key: API_KEY,
      language: 'en-US',
    },
  };

  return axios.get(`${BASE_URL}${id}/videos`, options);
}

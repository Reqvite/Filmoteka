import axios from 'axios';
const API_KEY = 'e145377b3a98d62607e7dc90339d279b';

export default async function fetchTrailerVideo() {
  return axios({
    method: 'get',
    url: `https://api.themoviedb.org/3/movie/${766475}/videos?${API_KEY}b&language=en-US`,
    params: {
      api_key: API_KEY,
      language: 'en-US',
    },
  });
}

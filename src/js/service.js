import axios from "axios";

export { fetchFilmDetails };

const API_KEY = 'e145377b3a98d62607e7dc90339d279b';

  fetchFilmDetails = () => {
    return  axios({
    method: 'get',
    url: `https://api.themoviedb.org/3/movie/${766475}?${API_KEY}b&language=en-US`,
        params: {
        api_key: API_KEY,
        language: 'en-US', 
       }
    })
}

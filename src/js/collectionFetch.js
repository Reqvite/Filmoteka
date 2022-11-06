// Усі жанри
import axios from 'axios';

export function buildUrl(pageNumber) {
    const key = `e145377b3a98d62607e7dc90339d279b`;
    const baseUrl = `https://api.themoviedb.org/3/trending/`
    const mediaType = `movie`;
    const time_window = `day`;

    return `${baseUrl}${mediaType}/${time_window}?api_key=${key}&page=${pageNumber}`
}


export async function fetchGenreId() {
    const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=894ef72300682f1db325dae2afe3e7e2&language=en-US`);
    return response;
}

export async function fetchPopularMovies(page) {
    const response = await axios.get(buildUrl(page));           
    return response;
}

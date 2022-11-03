

fetchdata = async () => {
    const trand = await (await fetch('https://api.themoviedb.org/3/trending/all/day?api_key=e145377b3a98d62607e7dc90339d279b')).json();
    console.log(trand)

    const search = await (await fetch('https://api.themoviedb.org/3/search/movie?api_key=e145377b3a98d62607e7dc90339d279b&language=en-US&query=psyho&page=1&include_adult=false')).json();
    console.log(search)

    const details = await (await fetch('https://api.themoviedb.org/3/movie/291625?api_key=e145377b3a98d62607e7dc90339d279b&language=en-US')).json();

    console.log(details)

     const trailer = await (await fetch('https://api.themoviedb.org/3/movie/291625/videos?api_key=e145377b3a98d62607e7dc90339d279b&language=en-US')).json();

    console.log(trailer)
}


fetchdata()
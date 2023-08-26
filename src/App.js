import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import MovieCard from './components/MovieCard';
import YouTube from 'react-youtube';

function App() {
  const IMAGE_PATH = "https://image.tmdb.org/t/p/w1280"
  const apiKey = "bd437e02de8d619e801fb27ad446c875"
  const API_URL = "https://api.themoviedb.org/3";

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState({});
  const [searchKey, setSearchKey] = useState("");
  const [playTrailer, setPlayTrailer] = useState(false)

  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover"
    try {
      const {data: {results}} = await axios.get(`${API_URL}/${type}/movie`, {
        params: {
          api_key: apiKey,
          query: searchKey
        },
      });

      
     
      setMovies(results)  
       await selectMovie(results[0])
      
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };
  const fetchMovie = async (id)=> {
    const {data} = await axios.get(`${API_URL}/movie/${id}`,{
      params: {
        api_key: apiKey,
        append_to_response: 'videos',
      }
    })

    return data
    
  }

  const selectMovie = async (movie) => {
    setPlayTrailer(false);
    const data = await fetchMovie(movie.id)
    setSelectedMovie(data)
  }

  useEffect(() => {
    fetchMovies();
  }, []);

  const renderMovies = () => (
    movies.map(movie =>(
      <MovieCard 
        key={movie.id}
        movie={movie}
        selectMovie={selectMovie} 
      />
    ))
  )

  const searchMovies = (e) => {
    e.preventDefault()
    fetchMovies(searchKey)
  }

  const renderTrailer = () => {
    const trailer = selectedMovie.videos.results.find(vid => vid.name === "Official Trailer");
    const key = trailer ? trailer.key : selectedMovie.videos.results[0].key;


    return (
      <YouTube 
        videoId={key}
        className="youtube-container"
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            controls: 0
          }
        }}
      />
    )
  }

  return (
    <div className="App">
    <header className='header'>
      <div className='header-content max-center'>
      <span>Kenxa Movie Trailer</span>

      <form onSubmit={searchMovies}>
        <input type='search' placeholder='Search for movies' onChange={(e) => setSearchKey(e.target.value)} />
        <button className='search-btn' type='submit'>🔍</button>
      </form>
      </div>
    </header>
    <div className='hero' style={{backgroundImage: `url("${IMAGE_PATH}${selectedMovie.backdrop_path}")`}}>
      <div className='hero-content max-center'>
      {playTrailer ? <button className='button button-close' onClick={()=> setPlayTrailer(false)}>Close</button> : null}
        {selectedMovie.videos && playTrailer ? renderTrailer() : null};
        <button className='button' onClick={()=> setPlayTrailer(true)}>Play Trailer</button>
        <h1 className='hero-title'>{selectedMovie.title}</h1>
        {selectedMovie.overview ? <p className='hero-overview'>{selectedMovie.overview}</p> : null}
      </div>
      
    </div>
      <div className='container max-center'>
        {renderMovies()}
      </div>
    </div>
  );
}

export default App;

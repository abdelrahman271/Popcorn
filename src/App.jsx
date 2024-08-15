import {useEffect, useState } from "react";
import useLocalStorageState from './Hooks/useLocalStorageState';
import Box from "./Components/Box";
import Loader from "./Components/Loader";
import Logo from "./Components/Logo";
import Main from "./Components/Main";
import MessageError from "./Components/MessageError";
import MovieDetails from "./Components/MovieDetails";
import MovieList from "./Components/MovieList";
import NavBar from "./Components/NavBar";
import NumResults from "./Components/NumResults";
import Search from "./Components/Search";
import WatchedSummary from "./Components/WatchedSummary";
import WatchedList from "./Components/WatchedList";


const KEY="817d5c4b";


export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useLocalStorageState([],'watched');

  const [selected,setSelect]=useState(null);
  const [error,setError]=useState("");
  const [isLoading,setIsLoading]=useState(false);


  useEffect(()=>{
    const controller = new AbortController();
    async function fetchData(){
      try{
        setIsLoading(true);
        setError("");
        const res=await fetch(`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,{signal:controller.signal})  ;
        if(!res.ok)throw new Error("Wrong with fetching movies");
        const data=await res.json();
        if(data.Response==="False")throw new Error("Movie not found");
        setMovies(data.Search);
        setError("");
      }
      catch(error){
        setError(error.message);
        setMovies([]);
      }
      finally{
        setIsLoading(false);
      }
    }
    if(query.length<3){
      setError("");
      setMovies([]);
      return;
    }
    onCloseMovie();
    fetchData();

    return function () {
      controller.abort();
    };
  },[query]);


  function handleSelect(id){
    setSelect((select)=>select?.id===id?null:id);
  }
  
  function onCloseMovie(){
    setSelect(null)
  }

  function addWatched(movie){
    setWatched((movies)=>[...movies,movie])
  }

  function deleteWatched(id){
    setWatched((movies)=>movies.filter((movie)=>movie.imdbID!==id))
  }

  return (
    <>
    <NavBar>
      <Logo />
      <Search query={query} setQuery={setQuery} />
      <NumResults movies={movies} />
    </NavBar>
    <Main>
      <Box>
        {
          isLoading?
          (<Loader />)
          :
          !isLoading && error?
          (<MessageError message={error}/>)
          :
          (<MovieList movies={movies} handleSelect={handleSelect}/>)
        }
      </Box>
      <Box>
      <>
        {selected?
          (<MovieDetails selected={selected} onCloseMovie={onCloseMovie} onAddWatched={addWatched} watched={watched}/>)
          :
          (<>
          <WatchedSummary watched={watched} />
          <WatchedList watched={watched} deleteWatched={deleteWatched}/>
          </>)
        }
        </>
    </Box>
    </Main>
    </>
  );
}




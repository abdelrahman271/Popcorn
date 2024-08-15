import { useEffect,useState } from "react";
import useKey from "../Hooks/useKey";
import StarRating from "./StarRating";
import Loader from "./Loader";
import MessageError from "./MessageError";

const KEY="817d5c4b";

export default function MovieDetails({selected,onCloseMovie,onAddWatched,watched}){
    const [movie,setMovie]=useState({});
    const [error, setError] = useState("");
    const [isLoading,setIsLoading]=useState(false);
    const [userRating, setUserRating] = useState("");
    const isWatched=watched.map((e)=>e.imdbID).includes(selected);
    const watchRating=watched.find((e)=>e.imdbID===selected)?.userRating;


    useKey("Escape",onCloseMovie);
    useEffect(()=>{
    async function fetchDetails(){
    try{
        setIsLoading(true);
        const res = await fetch(`https://www.omdbapi.com/?apikey=${KEY}&i=${selected}`);
        if(!res.ok)throw new Error("Wrong with fetching movies");
        const data=await res.json();
        if(data.Response==="False")throw new Error("Movie not found");
        console.log(data);
        setMovie(data);
        setError("");
        }
    catch (error) {
        setError(error.message);
        setMovie({});
        } 
    finally{
        setIsLoading(false);
        }
    }
    fetchDetails();
    },[selected]);

    useEffect(
    function () {
        if(!movie.Title)return;
        document.title = `Movie | ${movie.Title}`;
        return function () {
            document.title = "usePopcorn";
            console.log(`Clean up effect for movie ${movie.Title}`);
        };
    },
    [movie.Title]
    );
    function handleAdd() {
    const newWatchedMovie = {
        imdbID: selected,
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
        imdbRating: Number(movie.imdbRating),
        runtime: Number(movie.Runtime.split(" ").at(0)),
        userRating,
    };
        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }
    return (
    <div className="details">
        {isLoading ? (
        <Loader />
        ) : 
        error?(<MessageError  message={error}/>)
        :
        (
        <>
            <header>
            <button className="btn-back" onClick={onCloseMovie}>
                &larr;
            </button>
            <img src={movie.Poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
                <h2>{movie.Title}</h2>
                <p>
                {movie.Released} &bull; {movie.Runtime}
                </p>
                <p>{movie.Genre}</p>
                <p>
                    <span>⭐️</span>
                    {movie.ImdbRating} IMDb rating
                </p>
            </div>
            </header>
            <section>
            <div className="rating">
                {!isWatched ? (
                <>
                <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                    />
                    {userRating > 0 && (
                        <button className="btn-add" onClick={handleAdd} >
                            + Add to list
                        </button>
                    )}
                </>
                ) : (
                    <p>
                        You rated with movie {watchRating} <span>⭐️</span>
                    </p>
                )}
            </div>
                <p>
                <em>{movie.Plot}</em>
                </p>
                <p>Starring {movie.Actors}</p>
                <p>Directed by {movie.Director}</p>
            </section>
        </>
        )}
    </div>
    );
}

import WatchedMovie from "./WatchedMovie";

export default function WatchedList({watched,deleteWatched}){
    return(
    <ul className="list">
        {watched.map((movie) => (<WatchedMovie deleteWatched={deleteWatched} key={movie.imdbID} movie={movie}/>))}
    </ul>
    );
}
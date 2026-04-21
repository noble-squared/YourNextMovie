import type React from 'react';
import type { Genre, RankedMovie, SingleMovie } from '../../shared/MovieTypes';
import  MiniMovieCard from './MiniMovieCard.tsx';
import { useState } from 'react';

interface ExpandedMovieProps {
  movie: SingleMovie;
}

const ExpandedMovieComponent: React.FC<ExpandedMovieProps> = ({ movie }) => {
    const [internalLoading, setInternalLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [recommendedMovies, setRecommendedMovies] = useState<RankedMovie[] | undefined>(undefined);
    const [askedForRecommendations, setAskedForRecommendations] = useState(false);

    const getGenreNames = (genres: Genre[]): string => {
        return genres.map((genre) => {
            return genre.name || "Unknown Genre";
        }).join(', ');
    }

    const onLike = async () => { 
        setAskedForRecommendations(true);
        setRecommendedMovies([]);
        setInternalLoading(true);
        setError("");

        const res = await fetch(`/api/get-similar-movies/${movie.id}`);

        if(!res.ok){
            console.error(res);
            setError("Failed to fetch recommendations. Please try again later.");
            setRecommendedMovies(undefined);
        } else {
            const data = await res.json();
            console.log(data);
            setRecommendedMovies(data.movies);
        }

        setInternalLoading(false);
    }

    const onDislike = async () => {
        setAskedForRecommendations(true);
        setRecommendedMovies([]);
        setInternalLoading(true);
        setError("");

        const res = await fetch(`/api/get-different-movies/${movie.id}`);

        if(!res.ok){
            console.error(res);
            setError("Failed to fetch recommendations. Please try again later.");
            setRecommendedMovies(undefined);
        } else {
            const data = await res.json();
            console.log(data);
            setRecommendedMovies(data.movies);
        }

        setInternalLoading(false);
    }

    const safeOGGenres = Array.isArray(movie.genres) ? movie.genres : [];
    const genreLabel = safeOGGenres.length > 0 ? getGenreNames(safeOGGenres) : "Unknown Genre";

    return (
        <div className="expanded-movie">
            <h2>{movie.title}</h2>
            <h3>{genreLabel}</h3>
            <p>{movie.overview}</p>

            <button onClick={onLike}>I like this movie</button>
            <button onClick={onDislike}>I dislike this movie</button>
            {error && 
                <div className="error">
                    <p>{error}</p>
                </div>
            }
            {internalLoading ? <p>Loading...</p> : (
                <>
                    {recommendedMovies && recommendedMovies.length > 0 ? (
                        <div className="recommended-movies">
                            <h3>Recommended Movies:</h3>
                            {recommendedMovies.map((recommendedMovie) => (
                                <div key={recommendedMovie.movie.id}>
                                    <p>Ranking: {recommendedMovie.ranking}</p>
                                    <MiniMovieCard movie={recommendedMovie.movie} />
                                </div>
                            ))}
                        </div>
                    ): (
                        <>
                            { ( askedForRecommendations && !error ) && <p>No movies are available for recommendation.</p> }
                        </>
                    )}
                </>    
            )}

        </div>
    )
}

export default ExpandedMovieComponent;
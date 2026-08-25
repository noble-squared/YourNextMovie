import type React from 'react';
import type { Genre, RankedMovie, SingleMovie } from '../../shared/MovieTypes';
import  MiniMovieCard from './MiniMovieCard.tsx';
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react';
import type { UserRecommendationRequest } from '../../shared/user';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface ExpandedMovieProps {
  movie: SingleMovie;
}

const ExpandedMovieComponent: React.FC<ExpandedMovieProps> = ({ movie }) => {
    const [internalLoading, setInternalLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [recommendedMovies, setRecommendedMovies] = useState<RankedMovie[] | undefined>(undefined);
    const [askedForRecommendations, setAskedForRecommendations] = useState(false);

    const { user, addWatchedMovie } = useAuth();

    const navigate = useNavigate();

    const getGenreNames = (genres: Genre[]): string => {
        return genres.map((genre) => {
            return genre.name || "Unknown Genre";
        }).join(', ');
    }

    const onRecMovieClick = (movieID: number) => {
        navigate(`/movie/${movieID}`);
        setAskedForRecommendations(false);
        setRecommendedMovies(undefined);
    }

    const onLike = async () => { 
        setAskedForRecommendations(true);
        setRecommendedMovies([]);
        setInternalLoading(true);
        setError("");

        if (user) {
            try {
                await addWatchedMovie(movie.id);
            } catch (watchError) {
                console.error('Failed to update watched movies:', watchError);
            }
        }

        const res = user ? (
            await fetch(`/api/get-user-recommendations/${movie.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    liked_genres: user.liked_genres,
                    disliked_genres: user.disliked_genres,
                    watchedMovies: user.watched_movies,
                    liked: true,
                } as UserRecommendationRequest),
            }
        )) : ( await fetch(`/api/get-similar-movies/${movie.id}`));

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

        if (user) {
            try {
                await addWatchedMovie(movie.id);
            } catch (watchError) {
                console.error('Failed to update watched movies:', watchError);
            }
        }

        const res = user ? (
            await fetch(`/api/get-user-recommendations/${movie.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    liked_genres: user.liked_genres,
                    disliked_genres: user.disliked_genres,
                    watchedMovies: user.watched_movies,
                    liked: false,
                } as UserRecommendationRequest),
            }
        )) : ( await fetch(`/api/get-different-movies/${movie.id}`));

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

    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/assets/grey_square.jpg';
    
    const altText = movie.poster_path ? `The poster of the movie ${movie.title}` : '';

    return (
        <div className="expanded-movie">
            <h1>{movie.title}</h1>
            <img src={posterUrl} alt={altText} className='movie-poster' />
            <h3>{genreLabel}</h3>
            <p>{movie.overview}</p>

            {user && <p>Rate this movie to add it to your watched list.</p>}
            <button onClick={onLike} id='like'>I like this movie</button>
            <button onClick={onDislike} id='dislike'>I dislike this movie</button>
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
                            <Container fluid>
                                <Row>
                                    {recommendedMovies.map((recommendedMovie) => (
                                        <Col key={recommendedMovie.movie.id}
                                            xs={12} sm={6} md={4} lg={3} xl={2}
                                        >
                                            <p>Ranking: {recommendedMovie.ranking}</p>
                                            <button onClick={() => onRecMovieClick(recommendedMovie.movie.id)}>
                                                <MiniMovieCard movie={recommendedMovie.movie} />
                                            </button>
                                        </Col>
                                    ))}
                                </Row>
                            </Container>
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
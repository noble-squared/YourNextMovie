import type React from 'react';
import { genreNumbers } from '../../shared/movieGenres';
import type { CompleteMovie } from '../../shared/MovieTypes';
import { Card } from 'react-bootstrap';

interface MiniMovieCardProps {
    movie: CompleteMovie;
}

const MiniMovieCard: React.FC<MiniMovieCardProps> = ({ movie }) => {
    const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : 'Unknown year';
    const genres = movie.genre_ids
        .map((id) => genreNumbers.get(id))
        .filter((name): name is string => Boolean(name));
    
    const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w154${movie.poster_path}`
        : '/assets/grey_square.jpg';

    return (
        <Card style={{ background: 'black', margin: '5px', color:'white' }}>
            <Card.Img variant="top" src={posterUrl} />
            <Card.Body>
                <Card.Title>{movie.title} ({releaseYear})</Card.Title>
                <Card.Text>
                    {genres.length > 0 ? genres.join(', ') : 'No genres'}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default MiniMovieCard;
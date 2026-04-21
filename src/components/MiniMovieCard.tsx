import type React from 'react';
import { genreNumbers } from '../../shared/movieGenres';
import type { CompleteMovie } from '../../shared/MovieTypes';

interface MiniMovieCardProps {
    movie: CompleteMovie;
}

const MiniMovieCard: React.FC<MiniMovieCardProps> = ({ movie }) => {
    return (
        <div className="mini-movie-card">
            <p>{movie.title} ({movie.release_date ? movie.release_date.slice(0, 4) : "unknown"})</p>
            <p>{movie.genre_ids.map((id) => genreNumbers.get(id)).join(', ')}</p>
        </div>
    )
}

export default MiniMovieCard;
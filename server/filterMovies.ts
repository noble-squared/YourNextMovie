import movieGenres from '../shared/movieGenres.ts';
import type { CompleteMovie, TMDBSearchResponse } from '../shared/MovieTypes.ts';

export type MovieFilterCriteria = {
    title: string;
    includeAdult: boolean;
    genre?: string;
    year?: number;
};

export function filterTMDBMovies(
    data: TMDBSearchResponse,
    filters: MovieFilterCriteria,
): TMDBSearchResponse {
    const genreId = filters.genre ? movieGenres.get(filters.genre) : undefined;

    const results = data.results.filter((movie: CompleteMovie) => {
        const matchesAdultPreference = filters.includeAdult ? true : movie.adult === false;
        const matchesGenre = genreId ? movie.genre_ids.includes(genreId) : true;
        const matchesYear = filters.year
            ? movie.release_date?.startsWith(String(filters.year))
            : true;

        return matchesAdultPreference && matchesGenre && matchesYear;
    });

    return {
        ...data,
        results,
    };
}
import { describe, expect, test } from 'vitest';
import { getUserMovieDisSimilarityScore, getUserMovieSimilarityScore } from '../compareMovies.ts';
import type { CompleteMovie } from '../../shared/MovieTypes.ts';

const OGMovie: CompleteMovie = {
    id: 1,
    adult: false,
    backdrop_path: null,
    genre_ids: [35],
    original_language: 'en',
    original_title: 'Comedy One',
    overview: '',
    popularity: 10,
    poster_path: null,
    release_date: '2024-01-01',
    title: 'Comedy One',
    vote_average: 5,
    vote_count: 1,
};

const comparisonMovie: CompleteMovie = {
    id: 2,
    adult: false,
    backdrop_path: null,
    genre_ids: [18],
    original_language: 'en',
    original_title: 'Drama One',
    overview: '',
    popularity: 8,
    poster_path: null,
    release_date: '2024-01-01',
    title: 'Drama One',
    vote_average: 6,
    vote_count: 1,
};

describe('user recommendation scoring', () => {
    test('like and dislike scoring produce different values', () => {
        const likedGenres = ['Comedy'];
        const dislikedGenres: string[] = [];

        const likeScore = getUserMovieSimilarityScore(
            likedGenres,
            dislikedGenres,
            OGMovie,
            comparisonMovie,
        );

        const dislikeScore = getUserMovieDisSimilarityScore(
            likedGenres,
            dislikedGenres,
            OGMovie,
            comparisonMovie,
        );

        expect(likeScore).not.toBe(dislikeScore);
    });
});
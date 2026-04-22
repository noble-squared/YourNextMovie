import { describe, expect, test } from 'vitest';
import { filterTMDBMovies } from '../filterMovies.ts';
import type { TMDBSearchResponse } from '../../shared/MovieTypes.ts';

const baseResponse: TMDBSearchResponse = {
    page: 1,
    total_pages: 1,
    total_results: 3,
    results: [
        {
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
        },
        {
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
        },
        {
            id: 3,
            adult: false,
            backdrop_path: null,
            genre_ids: [35],
            original_language: 'en',
            original_title: 'Comedy Two',
            overview: '',
            popularity: 9,
            poster_path: null,
            release_date: '2023-01-01',
            title: 'Comedy Two',
            vote_average: 7,
            vote_count: 1,
        },
    ],
};

describe('filterTMDBMovies', () => {
    test('filters out non-comedy results when comedy is selected', () => {
        const filtered = filterTMDBMovies(baseResponse, {
            title: 'anything',
            includeAdult: false,
            genre: 'Comedy',
        });

        expect(filtered.results).toHaveLength(2);
        expect(filtered.results.map((movie) => movie.title)).toEqual(['Comedy One', 'Comedy Two']);
    });

    test('filters by year as well as genre', () => {
        const filtered = filterTMDBMovies(baseResponse, {
            title: 'anything',
            includeAdult: false,
            genre: 'Comedy',
            year: 2024,
        });

        expect(filtered.results).toHaveLength(1);
        expect(filtered.results[0].title).toBe('Comedy One');
    });

    test("filters out adult results if adult movies aren't enabled", () => {
        const filtered = filterTMDBMovies(
            {
                ...baseResponse,
                results: [
                    ...baseResponse.results,
                    {
                        id: 4,
                        adult: true,
                        backdrop_path: null,
                        genre_ids: [35],
                        original_language: 'en',
                        original_title: 'Comedy Adult',
                        overview: '',
                        popularity: 11,
                        poster_path: null,
                        release_date: '2024-01-01',
                        title: 'Comedy Adult',
                        vote_average: 4,
                        vote_count: 1,
                    },
                ],
            },
            {
                title: 'anything',
                includeAdult: false,
                genre: 'Comedy',
            },
        );

        expect(filtered.results.map((movie) => movie.title)).toEqual(['Comedy One', 'Comedy Two']);
    });
});
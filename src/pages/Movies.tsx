import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {z} from 'zod';
import type { CompleteMovie } from '../../shared/MovieTypes'
import MiniMovieCard from '../components/MiniMovieCard';

import { useNavigate } from 'react-router-dom';
import filterSchema from '../../shared/FilterSchema'
import movieGenres from '../../shared/movieGenres'


//Had to ask AI for help here
//type FilterFormValues = z.infer<typeof filterSchema>;
type FilterFormValues = z.input<typeof filterSchema>;
type FilterFormOutput = z.output<typeof filterSchema>;

const MoviesPage: React.FC = () => {
    const navigate = useNavigate();

    const [movies, setMovies] = useState<CompleteMovie[]>([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    //const searchForm = useForm<FilterFormValues>({
    const searchForm = useForm<FilterFormValues, undefined, FilterFormOutput>({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            title: '',
            genre: '',
            year: undefined,
        },
    });

    //const onSearch = async (values: FilterFormValues) => { 
    const onSearch = async (values: FilterFormOutput) => { 
        try {
            setLoading(true);
            const res = await fetch('/api/get-movies');

            if (!res.ok) {
                console.error(res);
                setError("Failed to fetch movies. Please try again later.");
            } else {
                const data = await res.json();

                setMovies(data.results);
                setSearched(true);

                console.log("Title: " + values.title);
                console.log("Genre: " + values.genre);
                console.log("Release year: " + values.year);
            }
        } catch (error) {
            if(error instanceof Error){
                setError(error.message);
            } else {
                setError("Failed to fetch movies. Please try again later.");
            }
            setSearched(false);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <h1>{searched ? "Movies" : "Search"}</h1>
            {error && 
                <div className="error">
                    <p>{error}</p>
                </div>
            }
            { searched ? (
                <>
                    <button onClick={() => setSearched(false)}>Clear search</button>
                    <ul>
                        {movies.map((movie) => (
                            <li key={movie.id || 268}>
                                <button onClick={() => navigate(`/movie/${movie.id ? movie.id : 268}`)}>
                                    <MiniMovieCard movie={movie} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <>
                    {loading ? (
                        <h2>Loading...</h2>
                    ) : (
                        <form onSubmit={searchForm.handleSubmit(onSearch)} className="searchForm">
                            <div className='search-title'>
                                <label htmlFor="search-title" className="label">
                                    Movie title
                                </label>
                                <input 
                                    id="search-title"
                                    type="text"
                                    placeholder="To Kill a Mockingbird"
                                    {...searchForm.register('title')}
                                />
                                {searchForm.formState.errors.title && (
                                    <div className="label">
                                        {searchForm.formState.errors.title.message}
                                    </div>
                                )}
                            </div>

                            <div className='search-genre'>
                                <label htmlFor="search-genre" className="label">
                                    Movie genre
                                </label>
                                <select id="search-genre" {...searchForm.register('genre')}>
                                    <option value="">Select a genre</option>
                                    {[...movieGenres.keys()].map((genre) => (
                                        <option key={genre.toString()} value={genre.toString()}>
                                            {genre}
                                        </option>
                                    ))}
                                </select>
                                {searchForm.formState.errors.genre && (
                                    <div className="label">
                                        {searchForm.formState.errors.genre.message}
                                    </div>
                                )}
                            </div>

                            <div className='search-year'>
                                <label htmlFor="search-year" className="label">
                                    Release year
                                </label>
                                <input 
                                    id="search-year"
                                    type="number"
                                    {...searchForm.register('year')}
                                />
                                {searchForm.formState.errors.year && (
                                    <div className="label">
                                        {searchForm.formState.errors.year.message}
                                    </div>
                                )}
                            </div>

                            <button type="submit">Search</button>
                        </form>
                    )}
                </>
            )}
        </>
    )
}

export default MoviesPage;
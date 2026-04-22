import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';
import { movieGenreNames } from '../../../shared/movieGenres';


const SignUp: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [likedGenres, setLikedGenres] = useState<string[]>([]);
    const [dislikedGenres, setDislikedGenres] = useState<string[]>([]);
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { signUp, loading } = useAuth();

    const navigate = useNavigate();

    const toggleLikedGenre = (genre: string) => {
        if (likedGenres.includes(genre)) {
            setLikedGenres(likedGenres.filter((g) => g !== genre));
            return;
        }

        setLikedGenres([...likedGenres, genre]);
        setDislikedGenres(dislikedGenres.filter((g) => g !== genre));
    };

    const toggleDislikedGenre = (genre: string) => {
        if (dislikedGenres.includes(genre)) {
            setDislikedGenres(dislikedGenres.filter((g) => g !== genre));
            return;
        }

        setDislikedGenres([...dislikedGenres, genre]);
        setLikedGenres(likedGenres.filter((g) => g !== genre));
    };
 
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if(!username || !password || !confirmPassword) {
            setError('All fields are required');
            setIsSubmitting(false);
            return;
        }
        if (username.length < 3) {
            setError('Username must be at least 3 characters long');
            setIsSubmitting(false);
            return;
        }
        if(password !== confirmPassword) {
            setError('Passwords do not match');
            setIsSubmitting(false);
            return;
        }

        try {
            const { error } = await signUp(username, password, { 
                full_name: name ,
                username: username,
                //TODO: implement in UI
                see_adult: true,
                liked_genres: likedGenres,
                disliked_genres: dislikedGenres,
                watched_movies: []
            });

            if (error) {
                setError(error);
                return;
            }

            navigate('/profile');
        } finally {
            setIsSubmitting(false);
        }
    };
 
    return (
        <>
            {error && (
                <div className="error">
                    <p>{error}</p>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="username"
                    name="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                />
                <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                />
                <div>
                    <label className="form-label">Select liked Genres</label>
                    <div>
                        {movieGenreNames.map((genre) => (
                            <label key={`liked-${genre}`}>
                                <input
                                    type="checkbox"
                                    checked={likedGenres.includes(genre)}
                                    onChange={() => toggleLikedGenre(genre)}
                                />
                                {genre}
                            </label>
                        ))}
                    </div>
                    <label className="form-label">Select disliked Genres</label>
                    <div>
                        {movieGenreNames.map((genre) => (
                            <label key={`disliked-${genre}`}>
                                <input
                                    type="checkbox"
                                    checked={dislikedGenres.includes(genre)}
                                    onChange={() => toggleDislikedGenre(genre)}
                                />
                                {genre}
                            </label>
                        ))}
                    </div>
                </div>
                <button disabled={loading || isSubmitting} type="submit">
                    {isSubmitting ? "Loading..." : "Sign Up"}
                </button>
            </form>
        </>
    );
};
 
export default SignUp;
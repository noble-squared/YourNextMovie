import type React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { movieGenreNames } from '../../shared/movieGenres';

const ProfilePage: React.FC = () => {
	const { user, loading, signOut, updateLikedGenres, updateSeeAdult, updateDislikedGenres } = useAuth();
	const [error, setError] = useState('');
	const [seeAdult, setSeeAdult] = useState(false);
	const [likedGenres, setLikedGenres] = useState<string[]>([]);
	const [dislikedGenres, setDislikedGenres] = useState<string[]>([]);
	const [isSavingLikedGenres, setIsSavingLikedGenres] = useState(false);
	const [isSavingDislikedGenres, setIsSavingDislikedGenres] = useState(false);
	const [isSavingAdultPreference, setIsSavingAdultPreference] = useState(false);
	const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            return;
        }

        setSeeAdult(user.see_adult);
        setLikedGenres(user.liked_genres);
        setDislikedGenres(user.disliked_genres);
    }, [user]);

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

    const handleUpdateAdultPreference = async () => {
        setError('');
        setIsSavingAdultPreference(true);

        try {
            await updateSeeAdult(seeAdult);
        } catch (error) {
            if (error instanceof Error) {
                setError(`Error updating adult content preference: ${error.message}`);
            } else {
                setError(`Error updating adult content preference: ${error}`);
            }
        } finally {
            setIsSavingAdultPreference(false);
        }
    };

	const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/authentication');
        } catch (error) {
            if (error instanceof Error) {
                setError(`Error signing out: ${error.message}`);
            } else {
                setError(`Error signing out: ${error}`);
            }
        }
	};

    const handleUpdateLikedGenres = async () => {
        setError('');
        setIsSavingLikedGenres(true);

        try {
            await updateLikedGenres(likedGenres);
        } catch (error) {
            if (error instanceof Error) {
                setError(`Error updating liked genres: ${error.message}`);
            } else {
                setError(`Error updating liked genres: ${error}`);
            }
        } finally {
            setIsSavingLikedGenres(false);
        }
    };

    const handleUpdateDislikedGenres = async () => {
        setError('');
        setIsSavingDislikedGenres(true);

        try {
            await updateDislikedGenres(dislikedGenres);
        } catch (error) {
            if (error instanceof Error) {
                setError(`Error updating disliked genres: ${error.message}`);
            } else {
                setError(`Error updating disliked genres: ${error}`);
            }
        } finally {
            setIsSavingDislikedGenres(false);
        }
    };

	if (loading) {
		return <p>Loading profile...</p>;
	}

	if (!user) {
        return <Navigate to="/authentication" replace />;
	}

	return (
		<div className="profile-page">
			<h1>{user.full_name || 'Unnamed user'}</h1>
            <p>{user.username || user.email?.split('@')[0]}</p>

            {error && 
                <div className="error">
                    <p>{error}</p>
                </div>
            }

            <div>
                <h3>Liked genres</h3>
                <p>{likedGenres.length > 0 ? likedGenres.join(', ') : "You don't have any liked genres."}</p>
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
                <button
                    type="button"
                    onClick={handleUpdateLikedGenres}
                >
                    {isSavingLikedGenres ? 'Saving liked genres...' : 'Save liked genres'}
                </button>
            </div>

            <div>
                <h3>Disliked genres</h3>
                <p>{dislikedGenres.length > 0 ? dislikedGenres.join(', ') : "You don't have any disliked genres."}</p>
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
                <button
                    type="button"
                    onClick={handleUpdateDislikedGenres}
                >
                    {isSavingDislikedGenres ? 'Saving disliked genres...' : 'Save disliked genres'}
                </button>
            </div>

            <div>
                <h3>Watched movies</h3>
                <p>{user.watched_movies.length > 0 ? user.watched_movies.join(', ') : "You haven't watched any movies yet. Find a movie and rate it to build your collection."}</p>
            </div>

            <div>
                <h3>Adult content</h3>
                <p>{seeAdult ? 'Allowed' : 'Hidden'}</p>
                <label>
                    <input
                        type="checkbox"
                        checked={seeAdult}
                        onChange={(event) => setSeeAdult(event.target.checked)}
                    />
                    Show adult content
                </label>
                <button
                    type="button"
                    onClick={handleUpdateAdultPreference}
                >
                    {isSavingAdultPreference ? 'Saving preference...' : 'Save adult preference'}
                </button>
            </div>

            <button onClick={handleSignOut}>Sign out</button>
		</div>
	);
};

export default ProfilePage;
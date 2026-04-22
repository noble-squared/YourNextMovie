import type React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
	const { user, loading, signOut } = useAuth();
	const navigate = useNavigate();

	const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/authentication');
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error signing out:', error.message);
            } else {
                console.error('Error signing out:', error);
            }
        }
	};

	if (loading) {
		return <p>Loading profile...</p>;
	}

	if (!user) {
        return <Navigate to="/authentication" replace />;
	}

	return (
		<section className="profile-page">
			<h1>{user.full_name || 'Unnamed user'}</h1>
            <p>{user.username || user.email?.split('@')[0]}</p>

            <div>
                <h3>Liked genres</h3>
                <p>{user.liked_genres.length > 0 ? user.liked_genres.join(', ') : "You don't have any liked genres."}</p>
            </div>

            <div>
                <h3>Disliked genres</h3>
                <p>{user.disliked_genres.length > 0 ? user.disliked_genres.join(', ') : "You don't have any disliked genres."}</p>
            </div>

            <div>
                <h3>Watched movies</h3>
                <p>{user.watched_movies.length > 0 ? user.watched_movies.join(', ') : "You haven't watched any movies yet. Find a movie and rate it to build your collection."}</p>
            </div>

            <div>
                <h3>Adult content</h3>
                <p>{user.see_adult ? 'Allowed' : 'Hidden'}</p>
            </div>

            <button onClick={handleSignOut}>Sign out</button>
		</section>
	);
};

export default ProfilePage;
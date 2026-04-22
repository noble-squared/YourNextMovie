import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom';


const SignUp: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const { signUp, loading } = useAuth();

    const navigate = useNavigate();

 
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if(!username || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }
        if(password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const { error } = await signUp(username, password, { 
            full_name: name ,
            username: username,
            //TODO: implement in UI
            see_adult: true,
            liked_genres: ["Fantasy", "Comedy"],
            disliked_genres: ["Horror"],
            watched_movies: []
        });

        if (error) {
            setError(error);
            return;
        } else {
            //TODO: navigate to profiles page
            navigate('/movies');
        }
    };
 
    return (
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
            {error && <div className="error">
                <p>{error}</p>
            </div>}
            <button disabled={loading} type="submit">
                {loading ? "Loading..." : "Sign Up"}
            </button>
        </form>
    );
};
 
export default SignUp;
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
 
const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { signIn, loading } = useAuth();

    const navigate = useNavigate();
 
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        if(!username || !password) {
            setError('All fields are required');
            return;
        }
        const { data, error } = await signIn(username, password);

        if (error) {
            setError(error);
            return;
        } else {
            console.log(data);
            navigate('/profile');
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
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button disabled={loading} type="submit">
                    {loading ? "Loading..." : "Login"}
                </button>
            </form>
        </>
    );
};
 
export default Login;
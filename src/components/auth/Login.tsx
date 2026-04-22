import React, { useState } from 'react';
 
const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
 
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!username || !password) {
            setError('All fields are required');
            return;
        }
        // will eventually replace with actual API call. Stretch goal.
        const isAuthenticated = true;
        if (isAuthenticated) {
            console.log('Login successful');
        } else {
            setError('Invalid username or password');
        }
    };
 
    return (
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
            {error && <div className="error">
                <p>{error}</p>
            </div>}
            <button type="submit">Login</button>
        </form>
    );
};
 
export default Login;
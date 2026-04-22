import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
 
const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { signIn, loading } = useAuth();

    const navigate = useNavigate();
 
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        if(!username || !password) {
            setError('All fields are required');
            setIsSubmitting(false);
            return;
        }
        try {
            const { data, error } = await signIn(username, password);

            if (error) {
                setError(error);
                return;
            }

            console.log(data);
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
                <button disabled={loading || isSubmitting} type="submit">
                    {isSubmitting ? "Loading..." : "Login"}
                </button>
            </form>
        </>
    );
};
 
export default Login;
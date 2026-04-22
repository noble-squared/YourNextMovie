import type React from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import { useNavigate } from 'react-router-dom';

const AuthenticationPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/profile');
        }
    }, [user, navigate]);

    if (loading && !user) {
        return <p>Loading...</p>;
    }

    return (
        <>
            {isLogin ? (
                <Login />
            ) : (
                <SignUp />
            )}
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Don't have an account? Sign Up" : "Have an account? Log In"}
            </button>
        </>
    );
}

export default AuthenticationPage;
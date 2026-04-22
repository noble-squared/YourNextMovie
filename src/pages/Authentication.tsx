import type React from 'react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import { useNavigate } from 'react-router-dom';

const AuthenticationPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    if (loading) {
        return <p>Loading...</p>;
    }

    if (user && !loading) {
        //TODO: navigate to profiles page
        navigate('/movies');
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
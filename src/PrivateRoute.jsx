import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { verifySession } from './http';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate()

    const getSessionIdFromCookie = () => {
        const cookies = document.cookie.split('; ');
        const sessionCookie = cookies.find(cookie => cookie.startsWith('session_id='));
        return sessionCookie ? sessionCookie.split('=')[1] : null;
    };

    const sessionId = getSessionIdFromCookie();

    const deleteCookie = (name) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

    const verifySessionData = async () => {
       
            const data = await verifySession();
            if (data.detail === "Wrong session id") {
                deleteCookie('session_id');
                setIsAuthenticated(false);
                navigate("/login")

            } else {
                setIsAuthenticated(true);
            }
            setIsLoading(false);
    };

    useEffect(() => {
        if (sessionId) {
            verifySessionData();
        } else {
            setIsLoading(false);  
            setIsAuthenticated(false);
        }
    }, [sessionId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

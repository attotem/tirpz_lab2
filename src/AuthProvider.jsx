import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const AuthContext = createContext({
    isAuthenticated: false,
    setIsAuthenticated: () => {},
});

export const AuthProvider = ({ children }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['session_id']);
    const [isAuthenticated, setIsAuthenticated] = useState(!!cookies.session_id);

    useEffect(() => {
        setIsAuthenticated(!!cookies.session_id);
    }, [cookies.session_id]); 

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

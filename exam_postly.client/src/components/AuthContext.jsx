// AuthContext.js
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [accessToken, setAccessToken] = useState(() => {
        return sessionStorage.getItem('accessToken') || null;
        return token && !isTokenExpired(token) ? token : null;
    });

    useEffect(() => {
        if (accessToken) {
            sessionStorage.setItem('accessToken', accessToken);
        } else {
            sessionStorage.removeItem('accessToken');
        }
    }, [accessToken]);

    const refreshToken = async () => {
        console.log("refreshing token");
        try {
            console.log("started refresh token fetch");
            const res = await axios.post(`${baseUrl}/user/refresh`, null, {
                withCredentials: true // needed to send the cookie
            });
            console.log("refresh token response got");
            setAccessToken(res.data.accessToken);
            console.log("refreshed token: ", res.data.accessToken);
            return res.data.accessToken;
        } catch (err) {
            console.log("error refreshing: ", err);
            setAccessToken(null);
            throw new Error("Unable to refresh token");
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, setAccessToken, refreshToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
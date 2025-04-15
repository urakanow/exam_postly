// useApi.js
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export default function useApi() {

    const { accessToken, setAccessToken, refreshToken } = useContext(AuthContext);

    const isTokenExpired = (token) => {
        if (!token) return true;

        try {
            const { exp } = jwtDecode(token);
            const currentUtcTime = Math.floor(Date.now() / 1000); // Current time in UTC seconds
            return currentUtcTime >= exp; // Compare as UNIX timestamps
        } catch (error) {
            console.error('Invalid token:', error);
            return true;
        }
    };

    const authorizedRequest = async (config) => {
        let token = accessToken;

        if (!token || isTokenExpired(token)) {
            token = await refreshToken();
        }

        const response = await axios({
            ...config,
            headers: {
                ...config.headers,
                Authorization: `Bearer ${accessToken}`
            },
            withCredentials: true  // For refresh token cookie
        });
        return response;
    };

    return { authorizedRequest };
}

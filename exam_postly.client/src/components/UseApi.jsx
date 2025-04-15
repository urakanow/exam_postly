// useApi.js
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export default function useApi() {

    const { accessToken, setAccessToken, refreshToken } = useContext(AuthContext);

    //const isTokenExpired = (token) => {

    //    try {
    //        const { exp } = jwtDecode(token);
    //        console.log("exp: ", exp * 1000, Date.now());
    //        return Date.now() >= exp * 1000;
    //    } catch (error) {
    //        console.log("token is expired: ", error);
    //        return true;
    //    }
    //};
    const isTokenExpired = (token) => {
        if (!token) return true;

        try {
            const { exp } = jwtDecode(token);
            const currentUtcTime = Math.floor(Date.now() / 1000); // Current time in UTC seconds
            console.log(`Token expires at (UTC): ${exp} | Current UTC: ${currentUtcTime}`);
            return currentUtcTime >= exp; // Compare as UNIX timestamps
        } catch (error) {
            console.error('Invalid token:', error);
            return true;
        }
    };

    const authorizedRequest = async (config) => {
        console.log("authorized request access token:", accessToken)
        let token = accessToken;

        if (!token || isTokenExpired(token)) {
            try {
                token = await refreshToken(); // get a new token
            } catch {
                console.log("session expired");
            }
        }

        //return axios({
        //    ...config,
        //    headers: {
        //        ...config.headers,
        //        Authorization: `Bearer ${token}`
        //    }
        //});
        try {
            const response = await axios({
                ...config,
                headers: {
                    ...config.headers,
                    Authorization: `Bearer ${accessToken}`
                },
                withCredentials: true  // For refresh token cookie
            });
            return response;
        } catch (error) {
            if (error.response?.status === 401) {
                // Token might be invalid despite checks
                throw new Error("Unauthorized");
            }
            throw error;
        }
    };

    return { authorizedRequest };
}

import { useEffect, useState, useContext } from 'react';
import '../App.css';
import { AuthContext } from './AuthContext';
import useApi from './UseApi';
import AuthForm from './AuthForm';

function PersonalPage() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [userData, setUserData] = useState();
    const { accessToken, showAuthForm } = useContext(AuthContext);
    const { authorizedRequest } = useApi();

    useEffect(() => {
        populateUserData();
    }, [accessToken]);

    return (
        <div>
            {userData ? (
                <div>
                    {userData.username}
                    {userData.email}
                </div>
            ) : (
                <div>
                    username placeholder 
                    email placeholder
                </div>
            )}
            {!accessToken && ( <AuthForm/> )}
        </div>
    );

    async function populateUserData() {
        try {
            const response = await authorizedRequest({
                method: 'get',
                url: `${baseUrl}/user/personal-page`
            });

            if (response.status == 200) {
                setUserData(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch user data:', err);
        }
    }
}

export default PersonalPage;
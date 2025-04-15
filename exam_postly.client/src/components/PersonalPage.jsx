import { useEffect, useState, useContext } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import useApi from './UseApi';

function PersonalPage() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [userData, setUserData] = useState();
    const { accessToken } = useContext(AuthContext);
    const [showLogin, setShowLogin] = useState(false);
    const { authorizedRequest } = useApi();

    useEffect(() => {
        console.log("useeffect");
        populateUserData();
        console.log("access token: ", accessToken);
        if (accessToken) {
            console.log("accessToken");
            //populateUserData();
            setShowLogin(false);
        }
        else {
            console.log("not accessToken");
            setShowLogin(true);
        }
    }, [accessToken]);

    return (
        <div>
            {userData ? (
                <div>
                    {userData.name}
                    {userData.email}
                </div>
            ) : (
                <div>
                    name placeholder 
                    email placeholder
                </div>
            )}

            {showLogin && (
                <LoginForm onSuccess={() => setShowLogin(false) } />
            ) }
        </div>
    );

    async function populateUserData() {
        //const response = await fetch(`${baseUrl}/user/personal-page`, {
        //    headers: {
        //        'Authorization': `Bearer ${accessToken}`
        //    }
        //});
        //if (response.ok) {
        //    const data = await response.json();
        //    setUserData(data);
        //}
        //try {
        //    const response = await axios.get(`${baseUrl}/user/personal-page`, {
        //        headers: {
        //            'Authorization': `Bearer ${accessToken}`
        //        }
        //    });
        //    console.log(response.data);
        //    setUserData(response.data);
        //} catch (error) {
        //    console.error('Failed to fetch user data:', error);
        //}

        try {
            const response = await authorizedRequest({
                method: 'get',
                url: `${baseUrl}/user/personal-page`
            });
            console.log("response: ", response)

            if (response.status == 200) {
                console.log("response is ok")
                setUserData(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch user data:', err);
        }
    }
}

export default PersonalPage;
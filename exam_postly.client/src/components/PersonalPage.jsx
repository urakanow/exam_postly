import { useEffect, useState, useContext } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import useApi from './UseApi';
import AuthForm from './AuthForm';

function PersonalPage() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [userData, setUserData] = useState();
    const { accessToken } = useContext(AuthContext);
    const [showLogin, setShowLogin] = useState(false);
    const { authorizedRequest } = useApi();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    //const [isLoginOrSignUp, setIsLoginOrSignUp] = useState(true);//true is login, false is sign up

    useEffect(() => {
        populateUserData();
        if (accessToken) {
            setShowLogin(false);
        }
        else {
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

            {showLogin && !showError && (
                //<LoginForm onSuccess={() => setShowLogin(false) } />
                <AuthForm
                    onSuccess={() => setShowLogin(false)}
                    onError={(errorMessage) => {
                        console.log(errorMessage);
                        setShowLogin(true);
                        setShowError(true);
                        setErrorMessage(errorMessage)
                    }} />
            )}
            {showLogin && showError && (
                
                //<LoginForm onSuccess={() => setShowLogin(false) } />
                <AuthForm
                    onSuccess={() => setShowLogin(false)}
                    onError={(errorMessage) => {
                        console.log(errorMessage);
                        setShowLogin(true);
                        setShowError(true);
                        setErrorMessage(errorMessage)
                    }}
                    errorText={errorMessage}
                />
            )}
        </div>
    );

    //async function showError(errorMessage) {
    //    console.log(errorMessage);
    //}

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
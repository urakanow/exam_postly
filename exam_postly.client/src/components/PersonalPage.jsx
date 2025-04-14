import { useEffect, useState, useContext } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import { AuthContext } from './AuthContext';

function PersonalPage() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [userData, setUserData] = useState();
    const { accessToken } = useContext(AuthContext);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        console.log(accessToken);
        if (accessToken) {
            populateUserData();
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

            {showLogin && (
                <LoginForm onSuccess={() => setShowLogin(false) } />
            ) }
        </div>
    );

    async function populateUserData() {
        const response = await fetch(`${baseUrl}/user/personal-page`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            setUserData(data);
        }
    }
}

export default PersonalPage;
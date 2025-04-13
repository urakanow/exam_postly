import { useEffect, useState } from 'react';
import '../App.css';
import LoginForm from './LoginForm';

function PersonalPage() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [userData, setUserData] = useState();

    useEffect(() => {
        populateUserData()
    }, []);

    return (
        <div>
            
            <ul>
                {userData === undefined ? <LoginForm /> :
                    <div>
                        userData.Name
                        userData.Email
                    </div>}
            </ul>
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
import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { AuthContext } from './AuthContext';

function AuthForm({ onSuccess, onError, errorText = "" }) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const { accessToken, setAccessToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [_errorText, setErrorText] = useState(errorText);

    return (
        <div>
            {isLogin ? (
                <form onSubmit={(e) => { e.preventDefault(); login(new FormData(e.target)); }}>
                    <h2>Login</h2>
                    <label>Email</label><br />
                    <input type="email" name="email_name" required /><br />
                    <label>Password</label><br />
                    <input type="password" name="password_name" required /><br />
                    <button type="submit">Login</button>
                    <button type="button" onClick={() => { setIsLogin(false); setErrorText(""); }}>Switch to Sign Up</button>
                    {_errorText && (
                        <span className="auth-error">{_errorText }</span>
                    )}
                </form>
            ) : (
                <form onSubmit={(e) => { e.preventDefault(); signup(new FormData(e.target)); }}>
                    <h2>Sign Up</h2>
                    <label>Name</label><br />
                    <input type="text" name="name_name" required /><br />
                    <label>Email</label><br />
                    <input type="email" name="email_name" required /><br />
                    <label>Password</label><br />
                    <input type="password" name="password_name" required /><br />
                    <button type="submit">Sign Up</button>
                    <button type="button" onClick={() => { setIsLogin(true); setErrorText(""); }}>Switch to Login</button>
                    {_errorText && (
                        <span className="auth-error">{_errorText}</span>
                    )}
                </form>
            )}
        </div>
    );

    async function signup(formData) {
        onSuccess();
        const name = formData.get("name_name");
        const email = formData.get("email_name");
        const password = formData.get("password_name");
        const response = await fetch(`${baseUrl}/user/signup`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: 'POST',
            body: JSON.stringify({ name, email, password })
        });
        if (response.ok) {
            const data = await response.json();
            console.log("user created successfully");
            setAccessToken(data.accessToken);
            //onSuccess();
        }
        else {
            const data = await response.json();
            onError(data.message);
            //setErrorText(data.message);
        }
    }

    async function login(formData) {
        console.log("error text: ", errorText);
        onSuccess();
        const email = formData.get("email_name");
        const password = formData.get("password_name");
        const response = await fetch(`${baseUrl}/user/signin`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        if (response.ok) {
            const data = await response.json();
            console.log("login successful");
            setAccessToken(data.accessToken);
            //onSuccess();
        }
        else {
            const data = await response.json();
            onError(data.message);
            //setErrorText(data.message);
        }
    }
}

export default AuthForm;
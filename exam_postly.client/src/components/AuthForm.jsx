import { useState, useContext } from 'react';
import '../App.css';
import { AuthContext } from './AuthContext';

function AuthForm() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const { setAccessToken, authErrorMessage, setAuthErrorMessage } = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div>
            <form onSubmit={(e) => {
                e.preventDefault();
                isLogin ? login() : signup();
            }}>
                <h2>{isLogin ? "Login" : "Sign Up"}</h2>

                {!isLogin && (
                    <>
                        <label>Username</label><br />
                        <input type="text"
                            name="username_name"
                            required
                            autoComplete="username"
                            onChange={(e) => setUsername(e.target.value)}
                        /><br />
                    </>
                )}

                <label>Email</label><br />
                <input type="email"
                    name="email_name"
                    required
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                /><br />

                <label>Password</label><br />
                <input type="password"
                    name="password_name"
                    required
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                /><br />

                <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>

                <button type="button" onClick={() => { setIsLogin(!isLogin); setAuthErrorMessage(""); }}>
                    {isLogin ? "Switch to Sign Up" : "Switch to Login"}
                </button>

                {authErrorMessage && (
                    <span className="auth-error">{authErrorMessage}</span>
                )}
            </form>
        </div>
    );

    async function signup() {
        setAccessToken("1")//to hide the auth form immediately
        const response = await fetch(`${baseUrl}/user/signup`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });

        await handleResponse(response);
    }

    async function login() {
        setAccessToken("1")//to hide the auth form immediately
        const response = await fetch(`${baseUrl}/user/signin`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        await handleResponse(response);
    }

    async function handleResponse(response) {
        const data = await response.json();
        if (response.ok) {
            setAccessToken(data.accessToken);
            setAuthErrorMessage("");
        }
        else {
            setAuthErrorMessage(data.message);
        }
    }
}

export default AuthForm;
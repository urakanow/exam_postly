import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { AuthContext } from './AuthContext';

function SignUpForm({ onSuccess }) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const { accessToken, setAccessToken } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <form action={signup}>
            <label>name</label><br />
            <input type="text" id="name" name="name_name" /><br />
            <label>email</label><br />
            <input type="text" id="email" name="email_name" /><br />
            <label>password</label><br />
            <input type="password" id="password" name="password_name" /><br />
            <button type="submit">sign up</button>
        </form>
    );

    async function signup(formData) {
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
            //setAccessToken(data.accessToken);
            //onSuccess();
        }
    }
}

export default SignUpForm;
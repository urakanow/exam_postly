import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function LoginForm() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    return (
        <form action={login}>
            <label>email</label><br />
            <input type="text" id="email" name="email_name" /><br />
            <label>password</label><br />
            <input type="text" id="password" name="password_name" /><br />
            <button type="submit">login</button>
        </form>
    );

    async function login(formData) {
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
            setUserData(data);
        }
    }
}

export default LoginForm;
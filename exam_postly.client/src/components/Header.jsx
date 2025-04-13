import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function Header() {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    return (
        <header>
            sample header
            <nav>
                <Link to="/">Home</Link>
                <Link to="/me">Me</Link>
            </nav>
        </header>
    );
}

export default Header;
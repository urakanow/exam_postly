import { useEffect, useState } from 'react';
import '../App.css';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function Layout({ children }) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    return (
        <div>
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
}

export default Layout;
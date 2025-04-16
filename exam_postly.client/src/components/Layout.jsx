import '../App.css';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function Layout({ children }) {
    return (
        <div>
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
}

export default Layout;
import { Link } from 'react-router-dom';
import '../App.css';

function Header() {
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
import { Link } from 'react-router-dom';
import '../App.css';

function Header() {
    return (
        <header>
            sample header
            <nav>
                <Link to="/exam_postly/">Home</Link>
                <Link to="/exam_postly/me">Me</Link>
            </nav>
        </header>
    );
}

export default Header;
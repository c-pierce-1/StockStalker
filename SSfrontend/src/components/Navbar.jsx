import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('tickerUser');
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container">
                <Link className="navbar-brand text-primary" to="/">StockStalker</Link>

                <div className="navbar-nav ms-auto">
                    {user ? (
                        <>
                            <Link className="nav-link" to="/watchlist">My Watchlist</Link>
                            <button className="btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link className="nav-link" to="/login">Login</Link>
                            <Link className="btn btn-primary ms-2" to="/register">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
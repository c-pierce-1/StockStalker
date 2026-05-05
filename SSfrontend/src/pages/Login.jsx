import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function Login({ setUser }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('${API_URL}/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                const userData = { id: data.id, username: data.username };
                setUser(userData);
                localStorage.setItem('tickerUser', JSON.stringify(userData));
                navigate('/watchlist');
            } else {
                alert("Login failed. Check your username/password.");
            }
        } catch (err) {
            console.error("Login error:", err);
        }
    };

    return (
        <div className="card mx-auto mt-5 shadow-sm" style={{ maxWidth: '400px' }}>
            <div className="card-body">
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Sign In</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      alert("Registration successful! Please login.");
      navigate('/login');
    } else {
      alert("Registration failed.");
    }
  };

  return (
    <div className="card mx-auto mt-5" style={{ maxWidth: '400px' }}>
      <div className="card-body">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" placeholder="Username" onChange={e => setUsername(e.target.value)} />
          <input className="form-control mb-2" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <button className="btn btn-primary w-100">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
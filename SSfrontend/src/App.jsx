import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Watchlist from './pages/Watchlist.jsx';
import StockDetails from './pages/StockDetails.jsx';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('tickerUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <Router>
      <div className="container bg-light p-4 rounded shadow min-vh-100 mb-5">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/watchlist" element={<Watchlist user={user} />} />
          <Route path="/stock/:ticker" element={<StockDetails user={user} />} />
        </Routes>
      </div>
    </Router >
  );
}

export default App;
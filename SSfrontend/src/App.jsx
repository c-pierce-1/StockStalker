import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tickers, setTickers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/watchlist');
      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setTickers(data);
      } else {
        setError(data.error || 'Failed to load watchlist');
      }

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Could not connect to the server.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      const response = await fetch('http://localhost:3000/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker_symbol: inputValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      fetchWatchlist();
      setInputValue('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/watchlist/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchWatchlist();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1>StockStalker MVP</h1>
      <p>Manage your personal stock watchlist.</p>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="e.g., AAPL"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Add to Watchlist</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h2>My Tracked Stocks</h2>
      {tickers.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {tickers.map((ticker) => (
            <li
              key={ticker.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                borderBottom: '1px solid #ddd',
                backgroundColor: '#1a5328',
                marginBottom: '8px',
                borderRadius: '4px'
              }}
            >

              <a
                href={`https://finance.yahoo.com/quote/${ticker.ticker_symbol}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 'bold', textDecoration: 'none', color: '#cecde0', fontSize: '1.2rem' }}
              >
                {ticker.ticker_symbol}
              </a>

              <button
                onClick={() => handleDelete(ticker.id)}
                style={{
                  backgroundColor: '#ff4d4d',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
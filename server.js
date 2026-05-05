require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );
        res.json(newUser.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Server error." });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length > 0) {
            const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
            if (validPassword) {
                req.session.userId = user.rows[0].id;
                res.json({ message: "Login successful", username: user.rows[0].username, id: user.rows[0].id });
            } else {
                res.status(400).json({ error: "Invalid password" });
            }
        } else {
            res.status(400).json({ error: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.get('/api/watchlist/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await pool.query(
            'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY id DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error occurred fetching watchlist' });
    }
});

app.post('/api/watchlist', async (req, res) => {
    try {
        const { user_id, ticker_symbol } = req.body;

        const newTicker = await pool.query(
            'INSERT INTO subscriptions (user_id, ticker_symbol) VALUES ($1, $2) RETURNING *',
            [user_id, ticker_symbol.toUpperCase()]
        );

        res.json(newTicker.rows[0]);
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') {
            res.status(400).json({ error: 'This ticker is already in your watchlist' });
        } else {
            res.status(500).json({ error: 'Server error occurred adding ticker' });
        }
    }
});

app.delete('/api/watchlist/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM subscriptions WHERE id = $1', [id]);
        res.json({ message: 'Ticker deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error occurred deleting ticker' });
    }
});

app.put('/api/watchlist/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { target_price } = req.body;
        await pool.query('UPDATE subscriptions SET target_price = $1 WHERE id = $2', [target_price, id]);
        res.json({ message: "Target price updated" });
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
});

/*app.get('/api/stock-history/:symbol', async (req, res) => {
    const { symbol } = req.params;
    const apiKey = process.env.FINNHUB_API_KEY;

    const to = Math.floor(Date.now() / 1000);
    const from = to - (30 * 24 * 60 * 60);

    try {
        const response = await fetch(
            `https://finnhub.io/api/v1/stock/candle?symbol=${symbol.toUpperCase()}&resolution=D&from=${from}&to=${to}&token=${apiKey}`
        );
        const data = await response.json();

        console.log(`FINNHUB RESPONSE FOR ${symbol}:`, data);

        res.json(data);
    } catch (err) {
        console.error("Fetch crashed:", err);
        res.status(500).json({ error: "Failed to fetch from Finnhub" });
    }
});
*/

app.get('/api/quote/:symbol', async (req, res) => {
    const { symbol } = req.params;
    const apiKey = process.env.FINNHUB_API_KEY;
    try {
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${apiKey}`);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error("Quote fetch crashed:", err);
        res.status(500).json({ error: "Failed to fetch quote from Finnhub" });
    }
});

app.get('/api/stock-history/:symbol', async (req, res) => {
    const { symbol } = req.params;
    const apiKey = process.env.FINNHUB_API_KEY;

    const to = Math.floor(Date.now() / 1000);
    const from = to - (30 * 24 * 60 * 60);

    try {
        const response = await fetch(
            `https://finnhub.io/api/v1/stock/candle?symbol=${symbol.toUpperCase()}&resolution=D&from=${from}&to=${to}&token=${apiKey}`
        );
        const data = await response.json();
        if (data.error || data.s === 'no_data') {
            console.warn(`Finnhub API blocked ${symbol}. Initializing fallback data.`);
            throw new Error("Finnhub API Error");
        }

        res.json(data);
    } catch (err) {
        console.error("Using fallback data.");
        const mockData = { c: [], t: [], s: "ok" };
        let basePrice = symbol.toUpperCase() === 'AAPL' ? 175 : 150;
        const now = Math.floor(Date.now() / 1000);

        for (let i = 30; i >= 0; i--) {
            mockData.t.push(now - (i * 86400));
            basePrice = basePrice + (Math.random() * 4 - 1.5);
            mockData.c.push(parseFloat(basePrice.toFixed(2)));
        }

        res.json(mockData);
    }
});

app.get('/api/market-news', async (req, res) => {
    const apiKey = process.env.FINNHUB_API_KEY;
    try {
        const response = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${apiKey}`);
        const data = await response.json();
        res.json(data.slice(0, 3)); 
    } catch (err) {
        console.error("Market news fetch crashed:", err);
        res.status(500).json({ error: "Failed to fetch market news" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
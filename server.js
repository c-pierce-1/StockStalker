require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.get('/api/watchlist', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM watchlist ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error occourred fetching watchlist' });
    }
});

app.post('/api/watchlist', async (req, res) => {
    try {
        const { ticker_symbol } = req.body;

        const newTicker = await pool.query(
            'INSERT INTO watchlist (ticker_symbol) VALUES ($1) RETURNING *',
            [ticker_symbol.toUpperCase()]
        );

        res.json(newTicker.rows[0]);
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') {
            res.status(400).json({ error: 'This ticker is already in your watchlist' });
        } else {
            res.status(500).json({ error: 'Server error occourred adding ticker' });
        }
    }
});

app.delete('/api/watchlist/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query('DELETE FROM watchlist WHERE id = $1', [id]);
        res.json({ message: 'Ticker deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error occourred delleting ticker' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
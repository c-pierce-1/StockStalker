import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Watchlist({ user }) {
    const [stocks, setStocks] = useState([]);
    const navigate = useNavigate();
    const [prices, setPrices] = useState({});
    const [news, setNews] = useState([]);
    const [targetAlerts, setTargetAlerts] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchWatchlist();
        fetchMarketNews();

    }, [user, navigate]);

    const fetchMarketNews = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/market-news`);
            if (response.ok) setNews(await response.json());
        } catch (err) {
            console.error("Failed to load market news", err);
        }

    };

    const fetchWatchlist = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/watchlist/${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setStocks(data);
                checkPricesAndNotify(data);
            }
        } catch (err) {
            console.error("Error fetching watchlist:", err);
        }
    };

    const checkPricesAndNotify = async (watchlistStocks) => {
        const livePrices = {};
        const newlyHitTargets = [];

        for (let stock of watchlistStocks) {
            try {
                const response = await fetch(`http://localhost:3000/api/quote/${stock.ticker_symbol}`);
                const data = await response.json();
                const currentPrice = data.c || 0;

                livePrices[stock.ticker_symbol] = {
                    current: currentPrice.toFixed(2),
                    high: (data.h || 0).toFixed(2),
                    low: (data.l || 0).toFixed(2)
                };

                if (stock.target_price && stock.target_price > 0 && currentPrice <= stock.target_price) {
                    newlyHitTargets.push(
                        `${stock.ticker_symbol} hit your target of $${stock.target_price}! (Current: $${currentPrice.toFixed(2)})`
                    );
                }
            } catch (err) {
                console.error(`Could not fetch live price for ${stock.ticker_symbol}`);
            }
        }
        setPrices(livePrices);

        if (newlyHitTargets.length > 0) {
            setTargetAlerts(newlyHitTargets);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/watchlist/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setStocks(stocks.filter(stock => stock.id !== id));
            }
        } catch (err) {
            console.error("Error deleting stock:", err);
        }
    };

    const handleUpdateTarget = async (id, price) => {
        if (!price) return;

        try {
            const response = await fetch(`http://localhost:3000/api/watchlist/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_price: price })
            });

            if (response.ok) {
                fetchWatchlist();
            }
        } catch (err) {
            console.error("Update failed:", err);
        }
    }

    return (
        <div className="container mt-5" style={{ maxWidth: '700px' }}>
            {targetAlerts.length > 0 && (
                <div className="alert alert-success alert-dismissible fade show shadow-sm" role="alert">
                    <strong>Target(s) Hit!</strong>
                    <ul className="mb-0 mt-2">
                        {targetAlerts.map((msg, index) => (
                            <li key={index} className="fw-semibold">{msg}</li>
                        ))}
                    </ul>
                    <button type="button" className="btn-close" onClick={() => setTargetAlerts([])}></button>
                </div>
            )}
            <h2 className="fw-bold text-dark">My Watchlist</h2>

            {stocks.length === 0 ? (
                <div className="alert alert-info text-center">
                    Your watchlist is empty. Go back <Link to="/">home</Link> and search for some stocks!
                </div>
            ) : (
                <div>
                    {stocks.map(stock => (
                        <div key={stock.id} className="card mb-3 shadow-sm">
                            <div className="card-body d-flex justify-content-between align-items-center p-3">
                                <div>
                                    <Link to={`/stock/${stock.ticker_symbol}`} className="text-dark fs-4 fw-bold d-block mb-1">
                                        {stock.ticker_symbol}
                                    </Link>

                                    <span className="text-success fw-bold me-3">
                                        Current: ${prices[stock.ticker_symbol]?.current || 'Loading...'}
                                    </span>
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                    <span className="badge bg-secondary p-2 d-flex align-items-center gap-2">
                                        Target Price:
                                        <input
                                            type="number"
                                            placeholder={`${stock.target_price || '0.00'}`}
                                            className="form-control form-control-sm text-center"
                                            style={{ width: '100px' }}
                                            onBlur={(e) => handleUpdateTarget(stock.id, e.target.value)}
                                        />
                                    </span>

                                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(stock.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Watchlist;
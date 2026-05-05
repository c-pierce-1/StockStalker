import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL;

function StockDetails({ user }) {
    const [realQuote, setRealQuote] = useState(null);
    const { ticker } = useParams();
    const [stockData, setStockData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const historyRes = await fetch(`${API_URL}/api/stock-history/${ticker}`);
                const historyData = await historyRes.json();
                setStockData(historyData);

                const quoteRes = await fetch(`${API_URL}/api/quote/${ticker}`);
                if (quoteRes.ok) {
                    const quoteData = await quoteRes.json();
                    setRealQuote(quoteData);
                }
            } catch (error) {
                console.error("Error fetching stock data:", error);
            }
        };
        fetchData();
    }, [ticker]);


    /*    const fetchStockDetails = async () => {
            try {
                const response = await fetch(`${API_URL}/api/stock-history/${ticker}`);
                const data = await response.json();
                if (response.ok) {
                    setStockData(data);
                } else {
                    console.error("Error fetching stock data");
                }
            } catch (err) {
                console.error("Network error:", err);
            }
        };
    */

    const formattedData = stockData?.c?.map((price, index) => ({
        price: price,
        time: new Date(stockData.t[index] * 1000).toLocaleDateString()
    }));

    const handleAddToWatchlist = async () => {
        try {
            const response = await fetch(`${API_URL}/api/watchlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    ticker_symbol: ticker
                })
            });

            if (response.ok) {
                alert(`${ticker} added to watchlist.`);
            } else {
                alert(`Failed to add ${ticker}. May already exist in watchlist.`);
            }
        } catch (err) {
            console.error("Error adding to watchlist:", err);
        }
    };

    const currentPrice = realQuote?.c ? realQuote.c.toFixed(2) : "Loading...";
    const highPrice = realQuote?.h ? realQuote.h.toFixed(2) : "Loading...";
    const lowPrice = realQuote?.l ? realQuote.l.toFixed(2) : "Loading...";

    return (
        <div className="container mt-4">
            <h1 className="display-4 fw-bold mb-4 text-dark">{ticker}</h1>
            <div className="row">
                <div className="col-md-8">
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={formattedData}>
                            <CartesianGrid strokeDasharray="2 3" />
                            <XAxis dataKey="time" />
                            <YAxis domain={['auto', 'auto']} />
                            <Tooltip />
                            <Line type="linear" dataKey="price" stroke="#286432" strokeWidth={2} dot={true} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="col-md-4">
                    <div className="card p-3">
                        <h3>Market Status</h3>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">Current Price: ${currentPrice}</li>
                            <li className="list-group-item">High: ${highPrice}</li>
                            <li className="list-group-item">Low: ${lowPrice}</li>
                        </ul>

                        {user ? (
                            <button className="btn btn-success mt-3 w-100" onClick={handleAddToWatchlist}>
                                Add to Watchlist
                            </button>
                        ) : (
                            <button className="btn btn-primary mt-3 w-100" onClick={() => navigate('/login')}>
                                Login to Add to Watchlist
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="row">
                <h1 className="display-7 fw-light mt-5 text-dark"> {ticker} NEWS COMING SOON...</h1>
            </div>

        </div>
    );

}

export default StockDetails;
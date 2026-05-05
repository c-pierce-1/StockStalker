import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('${API_URL}/api/market-news');
                if (response.ok) {
                    setNews(await response.json());
                }
            } catch (err) {
                console.error("News failed to load", err);
            }
        };
        fetchNews();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/stock/${query}`);
        }
    }

    const suggestions = ['AAPL', 'MSFT', 'TSLA', 'NVDA', 'GOOGL', 'AMZN', 'META'];
    const [randomStocks] = useState(() =>
        [...suggestions].sort(() => 0.5 - Math.random()).slice(0, 5)
    );

    return (
        <div className="text-center">
            <h1 className="display-4 fw-bold mb-4 text-dark">Search the Market</h1>

            <form onSubmit={handleSearch} className="mb-5">
                <div className="input-group input-group-lg mx-auto" style={{ maxWidth: '600px' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search Symbol (e.g. AAPL)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value.toUpperCase())}
                    />
                    <button className="btn btn-primary" type="submit">Search</button>
                </div>
            </form>

            <h3>Suggested Stocks</h3>
            <div className="d-flex justify-content-center gap-3 mb-5">
                {randomStocks.map(ticker => (
                    <button
                        key={ticker}
                        className="btn btn-outline-secondary btn-lg"
                        onClick={() => navigate(`/stock/${ticker}`)}
                    >
                        {ticker}
                    </button>
                ))}
            </div>

            <h3 className="mb-3  fw-bold text-dark">Market News</h3>
            <div className="row">
                {news.map((article, index) => (
                    <div key={index} className="col-md-4 mb-3">
                        <div className="card h-100 shadow-sm border-0">
                            {article.image && <img src={article.image} className="card-img-top" alt="News" style={{ height: '150px', objectFit: 'cover' }} />}
                            <div className="card-body">
                                <h6 className="card-title fw-bold">{article.headline}</h6>
                                <a href={article.url} target="_blank" rel="noopener noreferrer" className="stretched-link text-decoration-none">Read more</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
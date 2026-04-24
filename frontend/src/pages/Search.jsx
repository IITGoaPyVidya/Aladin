/**
 * Search page — Search for stocks by keyword and view suggestions.
 * Click on a stock to view comprehensive details.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { searchStocks } from "../services/api";
import "./Search.css";

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const data = await searchStocks(query);
      setSuggestions(data.suggestions || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || "Unknown error");
      setSuggestions([]);
      setTotal(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStockClick = (stockName) => {
    navigate(`/stock/${encodeURIComponent(stockName)}`);
  };

  return (
    <div className="search-page">
      <h1 className="search-title">🔍 Search Indian Stocks</h1>
      <p className="search-hint">
        Search by company name or keyword (e.g. <em>Tata</em>, <em>Reliance</em>, <em>Bank</em>)
      </p>

      <div className="search-bar-wrapper">
        <SearchBar
          value={query}
          onChange={setQuery}
          onSearch={handleSearch}
          loading={loading}
        />
      </div>

      {/* Status messages */}
      {error && <p className="error-text">⚠️ {error}</p>}
      {searched && !loading && !error && (
        <p className="result-count">
          {total === 0
            ? "No stocks found."
            : `Found ${total} matching stock${total !== 1 ? "s" : ""}`}
        </p>
      )}

      {/* Dynamic Search Results from Alpha Vantage */}
      {suggestions.length > 0 && (
        <div className="suggestions-container">
          <h2>📊 Search Results</h2>
          <p className="hint-text">Found {total} stocks - Click any card to view live data</p>
          <div className="suggestions-grid">
            {suggestions.map((stock, idx) => (
              <div
                key={idx}
                className="suggestion-card"
                onClick={() => handleStockClick(stock.name)}
              >
                <div className="stock-header-mini">
                  <div className="stock-symbol">{stock.symbol}</div>
                  <div className="match-score">Match: {(parseFloat(stock.matchScore) * 100).toFixed(0)}%</div>
                </div>
                <div className="stock-name">{stock.name}</div>
                <div className="stock-meta">
                  <span className="region-badge">{stock.region}</span>
                  <span className="type-badge">{stock.type}</span>
                </div>
                <div className="view-details">View Live Data →</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Search page — lets users search for stocks by name or symbol,
 * then displays a table of results fetched from the backend.
 */

import { useState } from "react";
import SearchBar from "../components/SearchBar";
import { searchStocks } from "../services/api";
import "./Search.css";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
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
      setResults(data.results);
      setTotal(data.total);
    } catch (err) {
      setError(err.message || "Unknown error");
      setResults([]);
      setTotal(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <h1 className="search-title">Search Stocks</h1>
      <p className="search-hint">
        Search by ticker symbol (e.g. <em>TCS</em>) or company name (e.g.{" "}
        <em>Infosys</em>). Leave blank to browse all stocks.
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
      {error && <p className="error-text">⚠ {error}</p>}
      {searched && !loading && !error && (
        <p className="result-count">
          {total === 0
            ? "No stocks found."
            : `Found ${total} stock${total !== 1 ? "s" : ""}`}
        </p>
      )}

      {/* Results table */}
      {results.length > 0 && (
        <div className="results-table-wrapper">
          <table className="results-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Price (₹)</th>
                <th>Change</th>
                <th>Change %</th>
                <th>Volume</th>
                <th>Sector</th>
              </tr>
            </thead>
            <tbody>
              {results.map((s) => {
                const isPos = s.change >= 0;
                return (
                  <tr key={s.symbol}>
                    <td className="sym">{s.symbol}</td>
                    <td>{s.name}</td>
                    <td>₹{s.price.toFixed(2)}</td>
                    <td className={isPos ? "positive" : "negative"}>
                      {isPos ? "+" : ""}
                      {s.change.toFixed(2)}
                    </td>
                    <td className={isPos ? "positive" : "negative"}>
                      {isPos ? "▲" : "▼"} {Math.abs(s.change_percent).toFixed(2)}%
                    </td>
                    <td>{s.volume.toLocaleString("en-IN")}</td>
                    <td>{s.sector || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

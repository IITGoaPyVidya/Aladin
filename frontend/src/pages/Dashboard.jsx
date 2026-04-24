/**
 * Dashboard page — shows placeholder charts and top stock movers.
 * Charts are built with Recharts; data is fetched from the backend.
 */

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { searchStocks, getPopularStocks, getSectorsData, screenStocks, getNewsSentiment } from "../services/api";
import StockCard from "../components/StockCard";
import "./Dashboard.css";

/* ── Placeholder chart data ── */

const PRICE_HISTORY = [
  { date: "Apr 17", RELIANCE: 2780, TCS: 3520, INFY: 1420 },
  { date: "Apr 18", RELIANCE: 2800, TCS: 3540, INFY: 1435 },
  { date: "Apr 19", RELIANCE: 2815, TCS: 3510, INFY: 1450 },
  { date: "Apr 20", RELIANCE: 2830, TCS: 3560, INFY: 1440 },
  { date: "Apr 21", RELIANCE: 2820, TCS: 3575, INFY: 1448 },
  { date: "Apr 22", RELIANCE: 2840, TCS: 3580, INFY: 1453 },
  { date: "Apr 23", RELIANCE: 2846, TCS: 3580, INFY: 1453 },
];

const SECTOR_DATA = [
  { name: "IT", value: 42 },
  { name: "Finance", value: 28 },
  { name: "Energy", value: 18 },
  { name: "FMCG", value: 7 },
  { name: "Others", value: 5 },
];

const SECTOR_COLORS = ["#e2c97e", "#4caf91", "#5b9bd5", "#e07c5c", "#9b7fc7"];

const VOLUME_DATA = [
  { symbol: "SBIN", volume: 8.9 },
  { symbol: "RELIANCE", volume: 4.8 },
  { symbol: "WIPRO", volume: 2.1 },
  { symbol: "HDFC", volume: 5.7 },
  { symbol: "INFY", volume: 3.5 },
];

export default function Dashboard() {
  const [stocks, setStocks] = useState([]);
  const [popularStocks, setPopularStocks] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [screenResults, setScreenResults] = useState([]);
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Screener filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");

  useEffect(() => {
    Promise.all([
      searchStocks(""),
      getPopularStocks(),
      getSectorsData(),
      getNewsSentiment("RELIANCE")
    ])
      .then(([stocksRes, popularRes, sectorsRes, newsRes]) => {
        setStocks(stocksRes.results?.slice(0, 6) || []);
        setPopularStocks(popularRes.stocks || []);
        if (sectorsRes.success) {
          setSectors(sectorsRes.sectors || []);
        }
        if (newsRes.success) {
          setNewsData(newsRes);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleScreener = async () => {
    try {
      const filters = {};
      if (minPrice) filters.min_price = parseFloat(minPrice);
      if (maxPrice) filters.max_price = parseFloat(maxPrice);
      if (sectorFilter) filters.sector = sectorFilter;
      filters.limit = 20;

      const result = await screenStocks(filters);
      if (result.success) {
        setScreenResults(result.results || []);
      }
    } catch (err) {
      console.error("Screener error:", err);
    }
  };

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Market Dashboard</h1>

      {/* ── Top movers strip ── */}
      <section className="section">
        <h2 className="section-title">Top Stocks</h2>
        {loading && <p className="loading-text">Loading stocks…</p>}
        {error && (
          <p className="error-text">⚠ Could not reach backend: {error}</p>
        )}
        <div className="stocks-strip">
          {stocks.map((s) => (
            <StockCard
              key={s.symbol}
              symbol={s.symbol}
              name={s.name}
              price={s.price}
              change={s.change}
              changePercent={s.change_percent}
            />
          ))}
        </div>
      </section>

      {/* ── Charts grid ── */}
      <div className="charts-grid">
        {/* Line chart — price history */}
        <section className="chart-card wide">
          <h2 className="section-title">Price History (7 days)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={PRICE_HISTORY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3f55" />
              <XAxis dataKey="date" stroke="#7a8fa6" tick={{ fontSize: 12 }} />
              <YAxis stroke="#7a8fa6" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "#1e2a3a", border: "1px solid #2d3f55" }}
                labelStyle={{ color: "#e2c97e" }}
              />
              <Legend wrapperStyle={{ color: "#a8b2c8" }} />
              <Line type="monotone" dataKey="RELIANCE" stroke="#e2c97e" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="TCS" stroke="#4caf91" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="INFY" stroke="#5b9bd5" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* Pie chart — sector allocation */}
        <section className="chart-card">
          <h2 className="section-title">Sector Allocation</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={SECTOR_DATA}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {SECTOR_DATA.map((entry, i) => (
                  <Cell key={entry.name} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#1e2a3a", border: "1px solid #2d3f55" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </section>

        {/* Bar chart — trading volume */}
        <section className="chart-card">
          <h2 className="section-title">Volume (M shares)</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={VOLUME_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3f55" />
              <XAxis dataKey="symbol" stroke="#7a8fa6" tick={{ fontSize: 12 }} />
              <YAxis stroke="#7a8fa6" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: "#1e2a3a", border: "1px solid #2d3f55" }}
                labelStyle={{ color: "#e2c97e" }}
              />
              <Bar dataKey="volume" fill="#4caf91" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* ══ NEW: Stock Screener ══ */}
      <section className="section screener-section">
        <h2 className="section-title">🔍 Advanced Stock Screener</h2>
        <div className="screener-filters">
          <div className="filter-group">
            <label>Min Price (₹)</label>
            <input
              type="number"
              placeholder="e.g., 100"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>Max Price (₹)</label>
            <input
              type="number"
              placeholder="e.g., 5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>Sector</label>
            <input
              type="text"
              placeholder="e.g., IT, Banking"
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="filter-input"
            />
          </div>
          <button onClick={handleScreener} className="screener-button">
            Apply Filters
          </button>
        </div>
        
        {screenResults.length > 0 && (
          <div className="screener-results">
            <h3>Found {screenResults.length} stocks:</h3>
            <div className="screener-grid">
              {screenResults.slice(0, 12).map((stock) => (
                <div key={stock.symbol} className="screener-card">
                  <div className="screener-symbol">{stock.symbol}</div>
                  <div className="screener-name">{stock.name}</div>
                  <div className="screener-price">₹{stock.price}</div>
                  <div className="screener-sector">{stock.sector}</div>
                  <div className={`screener-change ${stock.changePercent >= 0 ? 'positive' : 'negative'}`}>
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ══ NEW: Sectoral Heatmap ══ */}
      <section className="section heatmap-section">
        <h2 className="section-title">🎨 Live Sectoral Heatmap</h2>
        <div className="heatmap-grid">
          {sectors.map((sector) => (
            <div 
              key={sector.sector}
              className="heatmap-card"
              style={{
                background: sector.performance > 0 
                  ? `linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)`
                  : `linear-gradient(135deg, #f44336 0%, #e57373 100%)`,
              }}
            >
              <div className="heatmap-sector">{sector.sector}</div>
              <div className="heatmap-performance">
                {sector.performance > 0 ? '+' : ''}{sector.performance}%
              </div>
              <div className="heatmap-stocks">{sector.stockCount} stocks</div>
              <div className="heatmap-gainer">
                Top: {sector.topGainer} (+{sector.topGainerChange}%)
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ NEW: News Sentiment ══ */}
      {newsData && (
        <section className="section news-section">
          <h2 className="section-title">📰 Market Sentiment ({newsData.symbol})</h2>
          <div className="sentiment-header">
            <div className="sentiment-overall">
              <span className="sentiment-label">Overall Sentiment:</span>
              <span className={`sentiment-value ${newsData.overall_sentiment.toLowerCase()}`}>
                {newsData.overall_sentiment === 'Bullish' ? '😊' : newsData.overall_sentiment === 'Bearish' ? '😞' : '😐'} 
                {newsData.overall_sentiment}
              </span>
              <span className="sentiment-score">Score: {newsData.sentiment_score}</span>
            </div>
          </div>
          <div className="news-grid">
            {newsData.news.slice(0, 4).map((item, idx) => (
              <div key={idx} className="news-card">
                <div className={`news-sentiment ${item.sentiment.toLowerCase()}`}>
                  {item.sentiment === 'Bullish' ? '😊' : item.sentiment === 'Bearish' ? '😞' : '😐'}
                </div>
                <div className="news-headline">{item.headline}</div>
                <div className="news-meta">
                  <span className="news-source">{item.source}</span>
                  <span className="news-date">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Popular Stocks ── */}
      <section className="section">
        <h2 className="section-title">Popular Indian Stocks</h2>
        <div className="popular-stocks-grid">
          {popularStocks.map((stockName) => (
            <div key={stockName} className="popular-stock-card">
              {stockName}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

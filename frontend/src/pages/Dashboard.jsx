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
import { searchStocks, getRecommendations } from "../services/api";
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
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([searchStocks(""), getRecommendations()])
      .then(([stocksRes, recoRes]) => {
        setStocks(stocksRes.results.slice(0, 6));
        setRecommendations(recoRes.recommendations);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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

      {/* ── Recommendations table ── */}
      <section className="section">
        <h2 className="section-title">AI Recommendations</h2>
        <div className="reco-table-wrapper">
          <table className="reco-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Action</th>
                <th>Current ₹</th>
                <th>Target ₹</th>
                <th>Confidence</th>
                <th>Rationale</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((r) => (
                <tr key={r.symbol}>
                  <td className="sym">{r.symbol}</td>
                  <td>
                    <span className={`action-badge action-${r.action.toLowerCase()}`}>
                      {r.action}
                    </span>
                  </td>
                  <td>₹{r.current_price.toFixed(2)}</td>
                  <td>₹{r.target_price.toFixed(2)}</td>
                  <td>{(r.confidence * 100).toFixed(0)}%</td>
                  <td className="rationale">{r.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

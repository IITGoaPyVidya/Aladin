/**
 * Home page — landing page with a brief overview of Aladin.
 */

import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <h1 className="hero-title">
          <span className="brand-gold">Aladin</span>
          <br />
          Your Smart Stock Companion
        </h1>
        <p className="hero-sub">
          Analyse Indian equities, explore market trends, and receive AI-powered
          recommendations — all in one place.
        </p>
        <div className="hero-actions">
          <Link to="/dashboard" className="btn-primary">
            Open Dashboard
          </Link>
          <Link to="/search" className="btn-secondary">
            Search Stocks
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <span className="feature-icon">📊</span>
          <h3>Live Dashboard</h3>
          <p>Track price movements and market trends with interactive charts.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🔍</span>
          <h3>Smart Search</h3>
          <p>Instantly find any NSE-listed stock by name or ticker symbol.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🤖</span>
          <h3>AI Recommendations</h3>
          <p>
            Get BUY / SELL / HOLD signals backed by quantitative analysis.
          </p>
        </div>
      </section>
    </div>
  );
}

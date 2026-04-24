/**
 * Home page — Premium landing page with animations
 */

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Home.css";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`home-page ${isVisible ? 'visible' : ''}`}>
      <section className="hero fade-in">
        <h1 className="hero-title">
          <span className="brand-gold float">Aladin</span>
          <br />
          Your Smart Stock Companion
        </h1>
        <p className="hero-sub">
          Analyse Indian equities, explore market trends, and receive AI-powered
          recommendations — all in one place.
        </p>
        <div className="hero-actions">
          <Link to="/dashboard" className="btn-primary">
            <span>🚀 Open Dashboard</span>
          </Link>
          <Link to="/search" className="btn-secondary">
            <span>🔍 Search Stocks</span>
          </Link>
        </div>
      </section>

      <section className="features fade-in">
        <div className="feature-card">
          <span className="feature-icon">📊</span>
          <h3>Advanced Screener</h3>
          <p>Filter 1665+ stocks by price, sector, and performance metrics instantly.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🎨</span>
          <h3>Sector Heatmap</h3>
          <p>Visualize market sectors with color-coded performance indicators.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🤖</span>
          <h3>AI Analysts</h3>
          <p>
            Get insights from 5 different analyst personas - Buffett, Graham, and more!
          </p>
        </div>
      </section>

      <section className="stats-section fade-in">
        <div className="stat-item">
          <span className="stat-number">1,665+</span>
          <span className="stat-label">NSE Stocks</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">8</span>
          <span className="stat-label">Market Sectors</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">5</span>
          <span className="stat-label">AI Personas</span>
        </div>
      </section>
    </div>
  );
}

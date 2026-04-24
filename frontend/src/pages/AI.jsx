/**
 * AI Analyst page — Multiple analyst personas analyzing stocks
 */

import { useState } from "react";
import { getAIAnalysis } from "../services/api";
import "./AI.css";

const PERSONAS = [
  {
    id: "fundamental",
    name: "Warren Buffett Style",
    subtitle: "Deep Value Investor",
    icon: "💼",
    description: "Long-term fundamentals, intrinsic value, competitive moats",
    color: "#2e7d32"
  },
  {
    id: "technical",
    name: "Technical Trader",
    subtitle: "Chart Pattern Analyst",
    icon: "📈",
    description: "Support/resistance, momentum indicators, price action",
    color: "#1976d2"
  },
  {
    id: "growth",
    name: "Cathie Wood Style",
    subtitle: "Innovation Investor",
    icon: "🚀",
    description: "Disruptive technology, exponential growth, future trends",
    color: "#7b1fa2"
  },
  {
    id: "value",
    name: "Ben Graham Style",
    subtitle: "Contrarian Value",
    icon: "💎",
    description: "Undervalued assets, margin of safety, book value",
    color: "#d84315"
  },
  {
    id: "momentum",
    name: "Momentum Trader",
    subtitle: "Short-term Trends",
    icon: "⚡",
    description: "Price momentum, volume surges, quick profits",
    color: "#f57c00"
  }
];

export default function AI() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!searchQuery.trim() || !selectedPersona) {
      setError("Please enter a stock name and select an analyst persona");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await getAIAnalysis(searchQuery, selectedPersona.id);
      if (result.success) {
        setAnalysis(result);
      } else {
        setError(result.error || "Analysis failed");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationClass = (rec) => {
    if (rec === "BUY") return "recommendation-buy";
    if (rec === "SELL") return "recommendation-sell";
    return "recommendation-hold";
  };

  const getSentimentEmoji = (sentiment) => {
    if (sentiment === "Bullish") return "😊";
    if (sentiment === "Bearish") return "😞";
    return "😐";
  };

  return (
    <div className="ai-page">
      <div className="ai-header">
        <h1>🤖 AI Stock Analyst</h1>
        <p className="ai-subtitle">
          Get expert analysis from different investment perspectives
        </p>
      </div>

      {/* Search Section */}
      <section className="ai-search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Enter stock name (e.g., Tata Steel, Reliance, HDFC Bank)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ai-search-input"
            onKeyPress={(e) => e.key === "Enter" && handleAnalyze()}
          />
        </div>

        {/* Persona Selection */}
        <div className="personas-grid">
          {PERSONAS.map((persona) => (
            <div
              key={persona.id}
              className={`persona-card ${selectedPersona?.id === persona.id ? "selected" : ""}`}
              onClick={() => setSelectedPersona(persona)}
              style={{ borderColor: selectedPersona?.id === persona.id ? persona.color : "#ddd" }}
            >
              <div className="persona-icon" style={{ color: persona.color }}>
                {persona.icon}
              </div>
              <h3>{persona.name}</h3>
              <p className="persona-subtitle">{persona.subtitle}</p>
              <p className="persona-description">{persona.description}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !searchQuery || !selectedPersona}
          className="analyze-button"
        >
          {loading ? "Analyzing..." : "Analyze Stock"}
        </button>
      </section>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <section className="analysis-section">
          <div className="analysis-header">
            <div>
              <h2>{analysis.stock}</h2>
              <p className="analysis-persona">
                {analysis.persona.icon} {analysis.persona.name}
              </p>
              <p className="analysis-focus">{analysis.persona.focus}</p>
            </div>
            <div className={`recommendation ${getRecommendationClass(analysis.analysis.recommendation)}`}>
              <div className="rec-label">Recommendation</div>
              <div className="rec-value">{analysis.analysis.recommendation}</div>
              <div className="rec-confidence">{analysis.analysis.confidence}% Confidence</div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Current Price</div>
              <div className="metric-value">₹{analysis.analysis.current_price}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Target Price</div>
              <div className="metric-value">₹{analysis.analysis.target_price}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Potential Return</div>
              <div className="metric-value" style={{ color: analysis.analysis.potential_return > 0 ? "#4caf50" : "#f44336" }}>
                {analysis.analysis.potential_return > 0 ? "+" : ""}{analysis.analysis.potential_return}%
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Timeframe</div>
              <div className="metric-value">{analysis.analysis.timeframe}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Risk Level</div>
              <div className="metric-value">{analysis.analysis.risk_level}</div>
            </div>
            <div className="metric-card">
              <div className="metric-label">Industry</div>
              <div className="metric-value">{analysis.key_metrics.industry}</div>
            </div>
          </div>

          {/* Insights */}
          <div className="insights-section">
            <h3>📊 Key Insights</h3>
            <ul className="insights-list">
              {analysis.analysis.insights.map((insight, idx) => (
                <li key={idx}>{insight}</li>
              ))}
            </ul>
          </div>

          {/* Financial Metrics */}
          <div className="financials-section">
            <h3>💼 Financial Metrics</h3>
            <div className="financials-grid">
              <div className="financial-item">
                <span className="fin-label">P/E Ratio:</span>
                <span className="fin-value">{analysis.key_metrics.pe_ratio}</span>
              </div>
              <div className="financial-item">
                <span className="fin-label">52W High:</span>
                <span className="fin-value">₹{analysis.key_metrics.year_high}</span>
              </div>
              <div className="financial-item">
                <span className="fin-label">52W Low:</span>
                <span className="fin-value">₹{analysis.key_metrics.year_low}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer Info */}
      <div className="ai-footer">
        <p>💡 <strong>Tip:</strong> Different personas provide unique perspectives on the same stock. Try multiple analysts for comprehensive insights!</p>
      </div>
    </div>
  );
}

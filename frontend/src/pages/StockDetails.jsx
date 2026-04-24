/**
 * StockDetails page — Displays comprehensive stock information in tabs.
 * Similar to the Streamlit page 7 implementation.
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStockDetails } from "../services/api";
import "./StockDetails.css";

export default function StockDetails() {
  const { stockName } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!stockName) return;
    
    setLoading(true);
    setError(null);
    
    getStockDetails(stockName)
      .then((result) => {
        console.log("Full API response:", result);
        if (result.success) {
          console.log("Stock data received:", result.data);
          console.log("Financials:", result.data?.financials);
          console.log("ShareHolding:", result.data?.shareHolding);
          console.log("Company Profile:", result.data?.companyProfile);
          setData(result.data);
        } else {
          setError(result.error || "Failed to fetch stock details");
        }
      })
      .catch((err) => {
        console.error("Error fetching stock details:", err);
        setError(err.message || "Network error");
      })
      .finally(() => setLoading(false));
  }, [stockName]);

  if (loading) {
    return (
      <div className="stock-details-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading stock data for: {decodeURIComponent(stockName)}</p>
          <p className="loading-hint">This may take up to 30 seconds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-details-page">
        <div className="error-container">
          <h2>⚠️ Error</h2>
          <p><strong>Stock searched:</strong> {decodeURIComponent(stockName)}</p>
          <p><strong>Error:</strong> {error}</p>
          <p className="error-hint">
            💡 This API works best with Indian stocks. Try searching for: Tata Steel, Reliance Industries, HDFC Bank, Infosys, or TCS
          </p>
          <button onClick={() => navigate("/search")} className="back-button">
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="stock-details-page">
        <p>No data available</p>
      </div>
    );
  }

  const companyName = data.companyName || stockName;
  const industry = data.industry || "N/A";
  const currentPrice = data.currentPrice || {};
  const bsePrice = currentPrice.BSE || "N/A";
  const nsePrice = currentPrice.NSE || "N/A";
  const percentChange = data.percentChange || "N/A";
  const yearHigh = data.yearHigh || "N/A";
  const yearLow = data.yearLow || "N/A";

  const tabs = [
    { id: "overview", label: "📈 Overview", icon: "📈" },
    { id: "technical", label: "📊 Technical", icon: "📊" },
    { id: "peers", label: "🏢 Peer Comparison", icon: "🏢" },
    { id: "ratios", label: "🔢 Key Ratios", icon: "🔢" },
    { id: "analysts", label: "👨‍💼 Analyst Ratings", icon: "👨‍💼" },
    { id: "shareholding", label: "📊 Shareholding", icon: "📊" },
    { id: "corporate", label: "💰 Corporate Actions", icon: "💰" },
    { id: "profile", label: "🏛️ Company Profile", icon: "🏛️" },
    { id: "news", label: "📰 Recent News", icon: "📰" },
  ];

  return (
    <div className="stock-details-page">
      <button onClick={() => navigate("/search")} className="back-button">
        ← Back to Search
      </button>

      {/* Header */}
      <header className="stock-header">
        <h1>{companyName}</h1>
        <p className="industry">{industry}</p>
        
        {/* Price Metrics */}
        <div className="price-metrics">
          <div className="metric">
            <span className="label">BSE Price</span>
            <span className="value">₹{bsePrice}</span>
          </div>
          <div className="metric">
            <span className="label">NSE Price</span>
            <span className="value">₹{nsePrice}</span>
          </div>
          <div className="metric">
            <span className="label">Change</span>
            <span className={`value ${parseFloat(percentChange) >= 0 ? 'positive' : 'negative'}`}>
              {percentChange}%
            </span>
          </div>
          <div className="metric">
            <span className="label">52W High</span>
            <span className="value">₹{yearHigh}</span>
          </div>
          <div className="metric">
            <span className="label">52W Low</span>
            <span className="value">₹{yearLow}</span>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="tabs-container">
        <div className="tabs-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "overview" && <OverviewTab data={data} />}
          {activeTab === "technical" && <TechnicalTab data={data} />}
          {activeTab === "peers" && <PeerComparisonTab data={data} />}
          {activeTab === "ratios" && <KeyRatiosTab data={data} />}
          {activeTab === "analysts" && <AnalystRatingsTab data={data} />}
          {activeTab === "shareholding" && <ShareholdingTab data={data} />}
          {activeTab === "corporate" && <CorporateActionsTab data={data} />}
          {activeTab === "profile" && <CompanyProfileTab data={data} />}
          {activeTab === "news" && <RecentNewsTab data={data} />}
        </div>
      </div>
    </div>
  );
}

// Tab Components
function OverviewTab({ data }) {
  const companyProfile = data.companyProfile || {};
  const companyName = data.companyName || "N/A";
  const industry = data.industry || "N/A";
  const bseCode = companyProfile.exchangeCodeBse || "N/A";
  const nseCode = companyProfile.exchangeCodeNse || "N/A";
  const isin = companyProfile.isInId || "N/A";
  
  const currentPrice = data.currentPrice || {};
  const bsePrice = currentPrice.BSE || "N/A";
  const nsePrice = currentPrice.NSE || "N/A";
  const percentChange = data.percentChange || "N/A";
  const yearHigh = data.yearHigh || "N/A";
  const yearLow = data.yearLow || "N/A";
  
  const companyDescription = companyProfile.companyDescription || "";
  
  return (
    <div className="tab-panel">
      <h2>Market Overview</h2>
      
      {/* Company Description Passage */}
      {companyDescription && (
        <div className="company-description-section">
          <h3>About {companyName}</h3>
          <p className="description">
            {companyDescription.length > 1000 
              ? companyDescription.substring(0, 1000) + '...' 
              : companyDescription}
          </p>
        </div>
      )}
      
      <div className="info-grid">
        <div className="info-card">
          <h3>Basic Information</h3>
          <ul>
            <li><strong>Company:</strong> {companyName}</li>
            <li><strong>Industry:</strong> {industry}</li>
            <li><strong>ISIN:</strong> {isin}</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>Exchange Codes</h3>
          <ul>
            <li><strong>BSE:</strong> {bseCode}</li>
            <li><strong>NSE:</strong> {nseCode}</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>Current Prices</h3>
          <ul>
            <li><strong>BSE Price:</strong> ₹{bsePrice}</li>
            <li><strong>NSE Price:</strong> ₹{nsePrice}</li>
            <li><strong>Change:</strong> <span className={parseFloat(percentChange) >= 0 ? 'positive' : 'negative'}>{percentChange}%</span></li>
          </ul>
        </div>
        <div className="info-card">
          <h3>52-Week Range</h3>
          <ul>
            <li><strong>Year High:</strong> ₹{yearHigh}</li>
            <li><strong>Year Low:</strong> ₹{yearLow}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function TechnicalTab({ data }) {
  const technicalData = data.stockTechnicalData || [];
  
  if (!technicalData.length) {
    return <div className="tab-panel"><p>Technical data not available</p></div>;
  }

  return (
    <div className="tab-panel">
      <h2>Technical Indicators - Moving Averages</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Period</th>
            <th>BSE Price</th>
            <th>NSE Price</th>
          </tr>
        </thead>
        <tbody>
          {technicalData.map((item, idx) => (
            <tr key={idx}>
              <td>{item.days} Days</td>
              <td>₹{item.bsePrice}</td>
              <td>₹{item.nsePrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PeerComparisonTab({ data }) {
  const peers = data.companyProfile?.peerCompanyList || [];
  
  if (!peers.length) {
    return <div className="tab-panel"><p>Peer comparison data not available</p></div>;
  }

  return (
    <div className="tab-panel">
      <h2>Peer Company Comparison</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Price (₹)</th>
            <th>Change (%)</th>
            <th>Market Cap (Cr)</th>
            <th>P/E Ratio</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {peers.slice(0, 5).map((peer, idx) => (
            <tr key={idx}>
              <td>{peer.companyName}</td>
              <td>₹{peer.price?.toFixed(2)}</td>
              <td className={peer.percentChange >= 0 ? 'positive' : 'negative'}>
                {peer.percentChange?.toFixed(2)}%
              </td>
              <td>{peer.marketCap?.toFixed(2)}</td>
              <td>{peer.priceToEarningsValueRatio?.toFixed(2)}</td>
              <td>{peer.overallRating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KeyRatiosTab({ data }) {
  console.log("KeyRatiosTab - Full data:", data);
  const financials = data.financials || [];
  console.log("KeyRatiosTab - financials:", financials);
  console.log("KeyRatiosTab - financials type:", typeof financials, "length:", financials.length);
  
  if (!financials.length) {
    console.log("KeyRatiosTab - No financials data available");
    return <div className="tab-panel"><p>Financial ratio data not available</p></div>;
  }

  // Extract data from stockFinancialMap structure
  const finData = financials[0] || {};
  console.log("KeyRatiosTab - finData:", finData);
  
  const stockFinancialMap = finData.stockFinancialMap || {};
  console.log("KeyRatiosTab - stockFinancialMap:", stockFinancialMap);
  
  const valuation = stockFinancialMap.valuation || [];
  const priceVolume = stockFinancialMap.priceandVolume || [];
  console.log("KeyRatiosTab - valuation length:", valuation.length);
  console.log("KeyRatiosTab - priceVolume length:", priceVolume.length);

  return (
    <div className="tab-panel">
      <h2>Financial Ratios & Metrics</h2>
      
      {valuation.length > 0 && (
        <div className="ratios-section">
          <h3>Valuation Metrics</h3>
          <div className="ratios-grid">
            {valuation.map((item, idx) => (
              <div key={idx} className="ratio-card">
                <span className="ratio-label">{item.displayName || 'N/A'}</span>
                <span className="ratio-value">{item.value || 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {priceVolume.length > 0 && (
        <div className="ratios-section">
          <h3>Price & Volume</h3>
          <div className="ratios-grid">
            {priceVolume.map((item, idx) => (
              <div key={idx} className="ratio-card">
                <span className="ratio-label">{item.displayName || 'N/A'}</span>
                <span className="ratio-value">{item.value || 'N/A'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AnalystRatingsTab({ data }) {
  const analystView = data.analystView || [];
  
  if (!analystView.length) {
    return <div className="tab-panel"><p>Analyst rating data not available</p></div>;
  }

  return (
    <div className="tab-panel">
      <h2>Analyst Recommendations</h2>
      <div className="analyst-ratings">
        {analystView.map((rating, idx) => (
          <div key={idx} className="rating-row">
            <span className="rating-bullet" style={{backgroundColor: rating.colorCode}}>●</span>
            <span className="rating-name">{rating.ratingName}</span>
            <span className="rating-count">{rating.numberOfAnalystsLatest} analysts</span>
          </div>
        ))}
      </div>
      {data.averageRating && (
        <p className="average-rating">Average Rating: <strong>{data.averageRating}</strong></p>
      )}
    </div>
  );
}

function ShareholdingTab({ data }) {
  console.log("ShareholdingTab - Full data:", data);
  const shareholding = data.shareholding || [];  // lowercase 's'
  const promoterHolding = data.promoterShareHolding;
  const mutualFundHolding = data.mutualFundShareHolding || {};
  
  console.log("ShareholdingTab - shareholding:", shareholding);
  console.log("ShareholdingTab - shareholding type:", typeof shareholding, "length:", shareholding?.length);
  console.log("ShareholdingTab - promoterHolding:", promoterHolding);
  console.log("ShareholdingTab - mutualFundHolding:", mutualFundHolding);
  
  if (!shareholding.length && !promoterHolding && !Object.keys(mutualFundHolding).length) {
    console.log("ShareholdingTab - No shareholding data available");
    return <div className="tab-panel"><p>Shareholding pattern data not available</p></div>;
  }

  return (
    <div className="tab-panel">
      <h2>Shareholding Pattern</h2>
      
      {/* Quick Summary */}
      <div className="shareholding-summary">
        {promoterHolding && (
          <div className="summary-card">
            <h4>Promoter Holding</h4>
            <p className="big-number">{promoterHolding}%</p>
          </div>
        )}
        {mutualFundHolding.percentage && (
          <div className="summary-card">
            <h4>Mutual Fund Holding</h4>
            <p className="big-number">{mutualFundHolding.percentage}%</p>
            <p className="small-text">As of {mutualFundHolding.holdingDate}</p>
          </div>
        )}
      </div>
      
      {/* Detailed Breakdown */}
      {shareholding.map((category, idx) => {
        const categories = category.categories || [];
        if (!categories.length) return null;
        
        return (
          <div key={idx} className="shareholding-section">
            <h3>{category.displayName || 'N/A'}</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Holding (%)</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((item, i) => (
                  <tr key={i}>
                    <td>{item.holdingDate || 'N/A'}</td>
                    <td>{item.percentage || 'N/A'}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

function CorporateActionsTab({ data }) {
  const corporateActions = data.stockCorporateActionData || {};
  const dividends = corporateActions.dividend || [];
  const splits = corporateActions.splits || [];
  const boardMeetings = corporateActions.boardMeetings || [];

  return (
    <div className="tab-panel">
      <h2>Corporate Actions</h2>
      
      {dividends.length > 0 && (
        <div className="action-section">
          <h3>💵 Dividend History</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Record Date</th>
                <th>Amount (₹)</th>
                <th>Percentage</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {dividends.slice(0, 5).map((div, idx) => (
                <tr key={idx}>
                  <td>{div.recordDate}</td>
                  <td>₹{div.value?.toFixed(2)}</td>
                  <td>{div.percentage}%</td>
                  <td>{div.interimOrFinal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {splits.length > 0 && (
        <div className="action-section">
          <h3>✂️ Stock Splits</h3>
          {splits.map((split, idx) => (
            <p key={idx}>• <strong>{split.recordDate}:</strong> {split.remarks}</p>
          ))}
        </div>
      )}

      {boardMeetings.length > 0 && (
        <div className="action-section">
          <h3>📅 Upcoming Board Meetings</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              {boardMeetings.slice(0, 5).map((meeting, idx) => (
                <tr key={idx}>
                  <td>{meeting.boardMeetDate}</td>
                  <td>{meeting.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function CompanyProfileTab({ data }) {
  const companyProfile = data.companyProfile || {};
  const description = companyProfile.companyDescription || "";
  const officers = companyProfile.officers?.officer || [];

  return (
    <div className="tab-panel">
      <h2>Company Profile</h2>
      
      {description && (
        <div className="profile-section">
          <h3>📝 Company Description</h3>
          <p className="description">{description.substring(0, 1000)}...</p>
        </div>
      )}

      {officers.length > 0 && (
        <div className="profile-section">
          <h3>👥 Key Management</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Title</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              {officers.slice(0, 5).map((officer, idx) => {
                const name = `${officer.firstName || ''} ${officer.mI || ''} ${officer.lastName || ''}`.trim();
                const title = officer.title?.Value || officer.title || 'N/A';
                return (
                  <tr key={idx}>
                    <td>{name}</td>
                    <td>{title.substring(0, 50)}</td>
                    <td>{officer.age || 'N/A'}</td>
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

function RecentNewsTab({ data }) {
  const recentNews = data.recentNews || [];
  
  if (!recentNews.length) {
    return <div className="tab-panel"><p>📰 No recent news available</p></div>;
  }

  return (
    <div className="tab-panel">
      <h2>Recent News & Articles</h2>
      <p className="info-text">Showing {recentNews.length} recent articles</p>
      
      <div className="news-list">
        {recentNews.map((news, idx) => {
          const fullUrl = news.url.startsWith('/') 
            ? `https://www.livemint.com${news.url}` 
            : news.url;
          
          return (
            <div key={idx} className="news-item">
              {news.thumbnailImage && (
                <img src={news.thumbnailImage} alt="" className="news-thumbnail" />
              )}
              <div className="news-content">
                <h3>
                  <a href={fullUrl} target="_blank" rel="noopener noreferrer">
                    {news.headline}
                  </a>
                </h3>
                <p className="news-meta">
                  📅 {new Date(news.date).toLocaleDateString()} 
                  {news.timeToRead && ` • ⏱️ ${news.timeToRead} min read`}
                </p>
                {news.summary && <p className="news-summary">{news.summary}</p>}
                <a href={fullUrl} target="_blank" rel="noopener noreferrer" className="read-more">
                  Read full article →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
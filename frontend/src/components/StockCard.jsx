/**
 * StockCard — displays a single stock's price information.
 */

import "./StockCard.css";

export default function StockCard({ symbol, name, price, change, changePercent }) {
  const isPositive = change >= 0;

  return (
    <div className="stock-card">
      <div className="stock-card-header">
        <span className="stock-symbol">{symbol}</span>
        <span className={`stock-change ${isPositive ? "positive" : "negative"}`}>
          {isPositive ? "▲" : "▼"} {Math.abs(changePercent).toFixed(2)}%
        </span>
      </div>
      <div className="stock-name">{name}</div>
      <div className="stock-price">₹{price.toFixed(2)}</div>
      <div className={`stock-change-abs ${isPositive ? "positive" : "negative"}`}>
        {isPositive ? "+" : ""}
        {change.toFixed(2)}
      </div>
    </div>
  );
}

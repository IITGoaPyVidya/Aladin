/**
 * SearchBar — controlled input component for stock queries.
 *
 * Props:
 *   value      {string}   - current input value (controlled)
 *   onChange   {function} - called with the new value on each keystroke
 *   onSearch   {function} - called when the user submits (Enter / button click)
 *   loading    {boolean}  - shows a loading state on the button
 */

import "./SearchBar.css";

export default function SearchBar({ value, onChange, onSearch, loading = false }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch();
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search stocks — e.g. TCS, Infosys, RELIANCE…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Stock search"
      />
      <button
        className="search-btn"
        onClick={onSearch}
        disabled={loading}
        aria-label="Search"
      >
        {loading ? "…" : "Search"}
      </button>
    </div>
  );
}

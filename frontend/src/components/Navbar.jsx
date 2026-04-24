/**
 * Navbar — top navigation bar with links to Home, Dashboard, and Search.
 */

import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">🪄</span>
        <span className="brand-name">Aladin</span>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/search" className={({ isActive }) => (isActive ? "active" : "")}>
            Search
          </NavLink>
        </li>
        <li>
          <NavLink to="/ai" className={({ isActive }) => (isActive ? "active" : "")}>
            🤖 AI Analyst
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

/**
 * Navbar — top navigation bar with links to Home, Dashboard, and Search.
 * Includes mobile hamburger menu with slide-in animation.
 */

import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand" onClick={closeMenu}>
        <span className="brand-icon">🪄</span>
        <span className="brand-name">Aladin</span>
      </NavLink>

      {/* Mobile Menu Toggle */}
      <button 
        className={`menu-toggle ${menuOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <li>
          <NavLink 
            to="/" 
            end 
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            🏠 Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            📊 Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/search" 
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            🔍 Search
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/ai" 
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={closeMenu}
          >
            🤖 AI Analyst
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}


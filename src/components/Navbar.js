import './Navbar.css';
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [globalSearch, setGlobalSearch] = useState("");

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && globalSearch.trim()) {
      navigate('/universities', {
        state: {
          initSearch: globalSearch.trim()
        }
      });
      setGlobalSearch(""); // clear after search
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="flex-center logo" style={{ gap: "0.5rem", color: "#000", textDecoration: 'none' }}>
          <div className="logo-icon bg-black"></div>
          <span style={{ fontWeight: 600 }}>UniSearch India</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/universities" className={`nav-link ${location.pathname === '/universities' ? 'active' : ''}`}>Universities</Link>
          <Link to="/compare" className={`nav-link ${location.pathname === '/compare' ? 'active' : ''}`}>Compare</Link>
          <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Analytics</Link>
        </div>

        <div className="nav-actions">
          <div className="nav-search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search universities..."
              className="nav-search"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onKeyDown={handleSearchKeyPress}
            />
          </div>

          {user ? (
            <>
              <Link to="/profile" className="btn-text" style={{ textDecoration: 'none', fontWeight: 500 }}>Profile</Link>
              <button onClick={handleLogout} className="btn-outline" style={{ cursor: 'pointer', padding: '0.5rem 1rem' }}>Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-text" style={{ textDecoration: 'none', fontWeight: 500 }}>Login</Link>
              <Link to="/signup" className="btn-black" style={{ textDecoration: 'none' }}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

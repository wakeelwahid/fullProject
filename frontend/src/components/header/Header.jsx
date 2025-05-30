import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";
import axios from "axios";

const Header = () => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [walletData, setWalletData] = useState({
    balance: 0,
    winnings: 0,
    bonus: 0
  });

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
    document.body.style.overflow = !sidebarActive ? "hidden" : "auto";
  };

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 992;
      setIsMobile(newIsMobile);
      if (!newIsMobile && sidebarActive) {
        setSidebarActive(false);
        document.body.style.overflow = "auto";
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sidebarActive]);

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarActive(false);
    document.body.style.overflow = "auto";
  }, [location]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get("http://127.0.0.1:8000/api/user/wallet-balance/", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setWalletData({
            balance: parseFloat(response.data.balance) || 0,
            winnings: parseFloat(response.data.winnings) || 0,
            bonus: parseFloat(response.data.bonus) || 0
          });
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();

    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, []);

  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const handleProtectedRoute = (path, e) => {
    // Let AuthGuard handle the authentication check
    // No need to prevent default or show alert
  };

  const sidebarItems = [
    { name: "Home", icon: "home", path: "/" },
    { name: "Play", icon: "play", path: "/play" },
    { name: "My Profile", icon: "user", path: "/profile" },
    { name: "My Wallet", icon: "wallet", path: "/wallet" },
    { name: "Game History", icon: "history", path: "/history" },
    { name: "Transactions", icon: "exchange-alt", path: "/transactions" },
    { name: "Refer & Earn", icon: "users", path: "/refer" },
    { name: "Terms & Conditions", icon: "file-contract", path: "/terms" },
    { name: "Refund Policy", icon: "undo", path: "/refund" },
    { name: "Privacy Policy", icon: "user-shield", path: "/privacy" },
    { name: "Support", icon: "headset", path: "/support" },
  ];

  return (
    <div className={`header-container ${scrolled ? 'scrolled' : ''}`}>
      <nav className="navbar-custom">
        <div className="container">
          <button 
            className="navbar-toggler-box" 
            onClick={toggleSidebar}
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars" />
          </button>

          <div className="navbar-brand-box">
            <Link className="navbar-brand-custom" to="/">
              <i className="fas fa-crown me-2" />
              <span className="brand-text">VN</span>
            </Link>
          </div>

          <div className="wallet-info">
            
            <Link to="/wallet" className="wallet-box" aria-label="Wallet balance">
              <div className="wallet-amount">
                <i className="fas fa-coins" />
                <span>₹{walletData.balance.toFixed(2)}</span>
              </div>
              <div className="wallet-label">Wallet</div>
            </Link>
            <Link to="/wallet" className="wallet-box winning-box" aria-label="Winning balance">
              <div className="wallet-amount">
                <i className="fas fa-trophy" />
                <span>₹{walletData.winnings.toFixed(2)}</span>
              </div>
              <div className="wallet-label">Winnings</div>
            </Link>
          </div>
        </div>
      </nav>

      {sidebarActive && (
        <>
          <div className="sidebar-overlay" onClick={toggleSidebar} />
          <div className="sidebar">
            <div className="sidebar-header">
              <h3>
                <i className="fas fa-crown me-2" />
                Menu
              </h3>
              <button onClick={toggleSidebar} aria-label="Close menu">
                <i className="fas fa-times" />
              </button>
            </div>

            <div className="sidebar-items">
              {sidebarItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={(e) => {
                    handleProtectedRoute(item.path, e);
                    toggleSidebar();
                  }}
                >
                  <i className={`fas fa-${item.icon} me-3`} />
                  {item.name}
                </Link>
              ))}
              {!isAuthenticated() && (
                <>
                  <Link
                    to="/login"
                    className="sidebar-item"
                    onClick={toggleSidebar}
                  >
                    <i className="fas fa-sign-in-alt me-3" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="sidebar-item"
                    onClick={toggleSidebar}
                  >
                    <i className="fas fa-user-plus me-3" />
                    Register
                  </Link>
                </>
              )}
              {isAuthenticated() && (
                <button
                  className="sidebar-item logout-btn"
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                    window.location.reload();
                  }}
                >
                  <i className="fas fa-sign-out-alt me-3" />
                  Logout
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <div className="rules-btn-container">
        <Link to="/game-rules" className="rules-button">
          <i className="fas fa-scroll"></i> Game Rules
        </Link>
        <Link to="/mychips" className="rules-button">
          <i className="fas fa-dice"></i> MY BETS
        </Link>
      </div>
    </div>
  );
};

export default Header;
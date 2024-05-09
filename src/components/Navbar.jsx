import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [activeTab, setActiveTab] = useState("");

  const handleClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg bg-dark rounded">
        <div className="container-fluid">
          <Link className="navbar-brand text-danger" to="/">
            AdCompaign
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <NavItem
                active={activeTab === "home"}
                onClick={() => handleClick("home")}
                to="/"
              >
                Home
              </NavItem>
              <NavItem
                active={activeTab === "createBanner"}
                onClick={() => handleClick("createBanner")}
                to="/createBanner"
              >
                Create Compaign
              </NavItem>
              <NavItem
                active={activeTab === "compaignDetail"}
                onClick={() => handleClick("compaignDetail")}
                to="/compaignDetail"
              >
                Compaign Details
              </NavItem>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

const NavItem = ({ active, onClick, to, children }) => (
  <li className="nav-item">
    <Link
      className={`nav-link ${active ? "text-info fw-bold" : "text-white"}`}
      onClick={onClick}
      to={to}
    >
      {children}
    </Link>
  </li>
);

import React, { useState } from "react";
import { Link } from "react-router-dom";
import SideMenu from "./SideMenu";
import MenuIcon from '../assets/menu-w.png';
import loginicon from '../assets/login-4.png';
import '../style/header.css';

function Header() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  return (
    <header className="d-flex justify-content-between align-items-center p-3 flex-wrap position-relative">
      <div className="d-flex align-items-center gap-3">
        <button
          className="browse-btn btn"
          id="browseBtn"
          onClick={() => setSideMenuOpen(!sideMenuOpen)}
        >
          <img src={MenuIcon} alt="Menu" width="24" height="24" />
        </button>

        <Link
          to="/"
          className="text-white fs-2 d-none d-lg-block fw-bold"
          style={{ textDecoration: "none" }}
        >
          Cineverse
        </Link>
      </div>

      <div className="d-flex justify-content-center align-items-center gap-2">
        <Link
          to="/movies"
          className="head-btn btn d-none d-lg-block text-white fw-bold"
        >
          Movies
        </Link>

        <Link
          to="/tvshows"
          className="head-btn btn d-none d-lg-block text-white fw-bold"
        >
          TV Shows
        </Link>
      </div>

      <div className="position-absolute top-50 start-50 translate-middle d-lg-none">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div
            className="text-white text-center fw-bold"
            style={{ fontSize: "2.5rem" }}
          >
            Cineverse
          </div>
        </Link>
      </div>

      <div className="d-flex justify-content-center text-center align-items-center gap-2">
        <Link
          to="/watchlist"
          className="watchlist-btn btn d-none d-lg-block"
          id="watchlistbtn"
        >
          WatchList
        </Link>

        <Link
          to="/login"
          className="login-btn btn"
          id="loginbtn"
        >
          <img src={loginicon} alt="Login" width="30" height="30" />
        </Link>
      </div>

      <SideMenu isOpen={sideMenuOpen} onClose={() => setSideMenuOpen(false)} />
    </header>
  );
}

export default Header;

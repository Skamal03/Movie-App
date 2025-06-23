import React, { useState } from "react";
import { Link } from "react-router-dom";
import backicon from '../assets/back.png';
import '../style/sidebar.css';

function SideMenu({ isOpen, onClose }) {
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubMenu = (id) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className={`side-menu ${isOpen ? "open" : ""}`} id="sideMenu">
      <ul className="menu-list">
        <li>
          <button className="menu-btn back-btn" onClick={onClose}>
            <img src={backicon} alt="Back" width="35" height="35" /> Back
          </button>
        </li>

        <li>
          <Link to="/watchlist" className="simple-link menu-btn d-lg-none">
            WatchList
          </Link>
        </li>

        <li>
          <Link to="/movies" className="simple-link menu-btn d-lg-none">
            Movies
          </Link>
        </li>

        <li>
          <Link to="/tvshows" className="simple-link menu-btn d-lg-none">
            TV Shows
          </Link>
        </li>

        <li>
          <button
            className="menu-btn submenu-toggle"
            onClick={() => toggleSubMenu("genres")}
          >
            Genres ▾
          </button>
          <ul
            className={`submenu ${openSubmenus["genres"] ? "open" : ""} px-2`}
            id="genres">
            {["action", "comedy", "drama", "adventure", "horror", "war"].map(
              (genre) => (
                <li key={genre}>
                  <Link
                    to={`/${genre}`}
                    className="submenu-link"
                    data-category={genre}
                  >
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </Link>
                </li>
              )
            )}
          </ul>
        </li>

        <li>
          <button
            className="menu-btn submenu-toggle"
            onClick={() => toggleSubMenu("trending")}>
            Trending ▾
          </button>
          <ul
            className={`submenu ${openSubmenus["trending"] ? "open" : ""} px-2`}
            id="trending">
            <li>
              <Link to="/trendingtoday" className="submenu-link">
                Today
              </Link>
            </li>
            <li>
              <Link to="/thisweek" className="submenu-link">
                This Week
              </Link>
            </li>
          </ul>
        </li>

        <li>
          <button
            className="menu-btn submenu-toggle"
            onClick={() => toggleSubMenu("topRated")}
          >
            Top Rated ▾
          </button>
          <ul
            className={`submenu ${openSubmenus["topRated"] ? "open" : ""} px-2`}
            id="topRated"
          >
            <li>
              <Link to="/alltime" className="submenu-link">
                All Time
              </Link>
            </li>
            <li>
              <Link to="/thisyear" className="submenu-link">
                This Year
              </Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default SideMenu;

import React from "react";
import { Link } from "react-router-dom";
import '../style/style.css';

function Footer() {
  const userData = JSON.parse(localStorage.getItem("user"));
  const isAdmin = userData?.isAdmin === true;

  return (
    <footer className="text-center py-3">
      <p className="mb-0 text-white">&copy; 2025 MovieApp, All Rights Reserved</p>

      {isAdmin && (
        <Link to="/addmovie" className="btn text-white">Add Movie</Link>
      )}

      <Link to="/request-movie" className="btn text-white">Request Movie</Link>
      <Link to="/about" className="btn text-white">About Us</Link>
    </footer>
  );
}

export default Footer;

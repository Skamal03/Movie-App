import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import TVshows from "./pages/TVshows";
import Watchlist from "./pages/Watchlist";
import Login from "./pages/Login";

// Genre pages
import Action from "./pages/Action";
import Comedy from "./pages/Comedy";
import Drama from "./pages/Drama";
import Adventure from "./pages/Adventure";
import Horror from "./pages/Horror";
import War from "./pages/War";

// Trending pages
import TrendingToday from "./pages/Trendingtoday";
import ThisWeek from "./pages/Thisweek";

// Top Rated pages
import AllTime from "./pages/Alltime";
import ThisYear from "./pages/Thisyear";

import SearchResults from "./pages/SearchResults";

import AddMovies  from "./pages/Addmovies";

import MovieDetails from "./pages/Moviedetails";
import TvDetails from "./pages/Tvdetails";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tvshows" element={<TVshows />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/login" element={<Login />} />


        <Route path="/action" element={<Action />} />
        <Route path="/comedy" element={<Comedy />} />
        <Route path="/drama" element={<Drama />} />
        <Route path="/adventure" element={<Adventure />} />
        <Route path="/horror" element={<Horror />} />
        <Route path="/war" element={<War />} />


        <Route path="/trendingtoday" element={<TrendingToday />} />
        <Route path="/thisweek" element={<ThisWeek />} />


        <Route path="/alltime" element={<AllTime />} />
        <Route path="/thisyear" element={<ThisYear />} />

        <Route path="/search" element={<SearchResults />} />

        <Route path="/addmovie" element={<AddMovies />} />

        <Route path="/movie-details/:id" element={<MovieDetails />} />
        <Route path="/tv-details/:id" element={<TvDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

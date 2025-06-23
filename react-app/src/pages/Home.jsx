import React from "react";
import Header from "../components/Header";
import Banner from "../components/Banner";
import MovieList from "../components/MovieList";
import Footer from "../components/Footer";
import '../style/style.css';

const Home = () => {
  return (
    <>
      <Header />
      <Banner />
      <MovieList />
      <Footer />
    </>
  );
};

export default Home;

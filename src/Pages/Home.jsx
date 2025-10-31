import React from "react";
import Carousel from "../components/products/carousel/Carousel";
import LuxuryProducts from "../components/products/LuxuryProducts";
import LuxuryShop from "../components/products/LuxuryShop";


const Home = () => {
  return (
    <div>
      {/* Hero / Banner Section */}
      <Carousel />  
      {/* Products Section */}
      <LuxuryProducts /> 
      {/* Luxury Shop Section */}
      <LuxuryShop />
      {/* (Optional) You can add more sections later */}
      {/* <Testimonials /> */}
      {/* <Contact /> */}
    </div>
  );
};


export default Home;

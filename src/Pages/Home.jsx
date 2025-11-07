import React from "react";
import Carousel from "../components/products/carousel/Carousel";
import LuxuryProducts from "../components/products/LuxuryProducts";
import LuxuryShop from "../components/products/LuxuryShop";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Carousel />  
      <LuxuryProducts /> 
      <LuxuryShop />
    </div>
  );
};

export default Home;

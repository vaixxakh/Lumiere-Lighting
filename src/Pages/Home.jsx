import React from "react";
import Carousel from "../components/products/carousel/Carousel";
import LuxuryProducts from "../components/products/LuxuryProducts";
import LuxuryShop from "../components/products/LuxuryShop";


const Home = () => {
  return (
    <div>
      <Carousel />  
      <LuxuryProducts /> 
      <LuxuryShop />
    </div>
  );
};


export default Home;

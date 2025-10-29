import React from "react";
import LuxuryCarousel from "../components/LuxuryCarousel";
import LuxuryProducts from "../components/LuxuryProducts";
import LuxuryLightShop from "../components/LuxuryLightShop";

const Home = () => {
  return (
    <div>
      {/* Hero / Banner Section */}
      <LuxuryCarousel /> 
      

      {/* Products Section */}
      <LuxuryProducts />
           <LuxuryLightShop/>

      {/* (Optional) You can add more sections later */}
      {/* <Testimonials /> */}
      {/* <Contact /> */}
    </div>
  );
};

export default Home;

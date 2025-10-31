import React from "react";
import LuxuryCarousel from "../components/shared/features/products/carousel/LuxuryCarousel";
import LuxuryProducts from "../components/shared/features/products/LuxuryProducts";
import LuxuryLightShop from "../components/shared/features/products/LuxuryLightShop";

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

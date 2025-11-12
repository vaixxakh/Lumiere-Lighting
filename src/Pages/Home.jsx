import React from "react";
import Carousel from "../components/products/carousel/Carousel";
import LuxuryProducts from "../components/products/LuxuryProducts";
import LuxuryShop from "../components/products/LuxuryShop";
import { motion } from "framer-motion";

const Home = () => {
  return (
   <motion.div
      initial={{ opacity: 0, y: 40 }}   
      animate={{ opacity: 1, y: 0 }}   
      exit={{ opacity: 0, y: -20 }}    
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen"
    >
      <Carousel />  
      <LuxuryProducts /> 
      <LuxuryShop />
    </motion.div>
  );
};

export default Home;

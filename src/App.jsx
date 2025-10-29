import React from 'react'
import Navbar from './components/Navbar'
import Home from './Pages/Home'
import Footer from './components/Footer';
import { Routes, Route } from "react-router-dom";
import Products from './Pages/Products'
import LuxuryLightShop from './components/LuxuryLightShop';
import LuxuryProducts from './components/LuxuryProducts';


function App() {
  return (
    <div>
      
        <Navbar/>
      
  
  
       <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/luxuryabout" element={<LuxuryLightShop/>}/>
        <Route path="/collections" element={<LuxuryProducts/>}/>

       </Routes>
       <Footer/>

    </div>
  )
}

export default App

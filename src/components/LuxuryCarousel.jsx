import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function LuxuryCarousel() {
  const slides = [
      {
        // Chandelier
      image:
        "https://images.unsplash.com/photo-1531762948975-73032b7b61f4?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2hhbmRlbGllcnxlbnwwfHwwfHx8MA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
      title: "Ethereal Crystal Dome",
      desc: "Hand-crafted crystal dome with golden accents — perfect for high ceilings.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1616627454361-4a81b083da1c?auto=format&fit=crop&w=1600&q=80",
      title: "Aurora Halo Pendant",
      desc: "Brushed brass circular pendant with diffused warm LED — modern and serene.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
      title: "Velora Cascade Light",
      desc: "Layered glass rings cascading down in harmony — subtle luxury illumination.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1602216348997-1bfb7c99ac70?auto=format&fit=crop&w=1600&q=80",
      title: "Opulent Orb Chandelier",
      desc: "Spherical crystal design with ambient LED flow for contemporary spaces.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1635776061962-3e27cdbd71cb?auto=format&fit=crop&w=1600&q=80",
      title: "Celestia Gold Beam",
      desc: "Matte-gold frame with geometric lighting bars — futuristic yet refined.",
    },
  ];

  return (
    <div className="mt-24">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={4000}
        transitionTime={1000}
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-[80vh] object-cover brightness-75"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white">
              <h2 className="text-5xl md:text-6xl font-serif font-bold tracking-wide drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="mt-3 text-lg md:text-xl font-light tracking-wide text-gray-200 max-w-2xl drop-shadow-md">
                {slide.desc}
              </p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default LuxuryCarousel;

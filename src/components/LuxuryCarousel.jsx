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
        // Pendant 
      image:
        "https://imgs.search.brave.com/loTpuLK8KSPGayCmXdinnqEWmOPCBENhwcRKOeyB7II/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE2/MDI4NzYxNTMzMDYt/OWE1OTE3MGQ5ZDhk/P2ZtPWpwZyZ3PTMw/MDAmYXV0bz1mb3Jt/YXQmZml0PWNyb3Am/cT02MCZpeGxpYj1y/Yi00LjAuMyZpeGlk/PU0zd3hNakEzZkRC/OE1IeHpaV0Z5WTJo/OE1URjhmSEJsYm1S/aGJuUWxNakJzYVdk/b2RITjhaVzU4TUh4/OE1IeDhmREE9",
      title: "Aurora Halo Pendant",
      desc: "Brushed brass circular pendant with diffused warm LED — modern and serene.",
    },
    {
        // Floor Lampp
      image:
        "https://img.freepik.com/free-photo/modern-photorealistic-lamp-design_23-2151039026.jpg?t=st=1761657701~exp=1761661301~hmac=5725e7af114f4c380823ee61340c7db5e50c5f00f9ca58b7912b8ed0ed34887c&w=740",
      title: "Velora Cascade Light",
      desc: "Layered glass rings cascading down in harmony — subtle luxury illumination.",
    },
    {
        // Table Lights
      image:
        "https://imgs.search.brave.com/ms43qUjUGDfYzvLKukpCBuRTl3_Eb3xGFHzKHuniJ8Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/MTc5OTExMDQxMjMt/MWQ1NmE2ZTgxZWQ5/P2l4bGliPXJiLTQu/MS4wJml4aWQ9TTN3/eE1qQTNmREI4TUh4/elpXRnlZMmg4TVRS/OGZIUmhZbXhsSlRJ/d2JHRnRjSHhsYm53/d2ZId3dmSHg4TUE9/PSZmbT1qcGcmcT02/MCZ3PTMwMDA",
      title: "Opulent Orb Chandelier",
      desc: "Spherical crystal design with ambient LED flow for contemporary spaces.",
    },
    {
        // Wall Lights
      image:
        "https://imgs.search.brave.com/a7hr-JKLL9LezKv58qwBQts4Y1JDudKKYIFv54K36vg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjF6K1ZXTGdNRUwu/anBn",
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

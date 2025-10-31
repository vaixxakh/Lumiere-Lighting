import React from "react";
import generatedVideo from "../../assets/generated-video.mp4";


function LuxuryLightShop() {
  return (
    <>
      {/* Background Video Section */}
      <section className="relative w-full min-h-screen overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={generatedVideo}
        ></video>

        {/* Overlay for dim effect */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Text Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-yellow-200 drop-shadow-lg leading-tight">
            Discover the Glow of Luxury
          </h1>
          <p className="mt-5 text-gray-200 text-lg md:text-xl max-w-2xl">
            Explore exclusive chandeliers, pendant lights, and designer fixtures crafted for elegance.
          </p>
        </div>
      </section>

      {/* Explore More Button */}
      <div className="flex justify-center mt-10 mb-16">
        <button className="bg-black text-white hover:bg-white hover:text-black font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-400">
          Explore More
        </button>
      </div>
    </>
  );
}

export default LuxuryLightShop;

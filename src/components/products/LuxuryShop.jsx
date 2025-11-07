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

        {/* Text Content - Responsive */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 md:px-8 lg:px-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-yellow-200 drop-shadow-lg leading-tight">
            Discover the Glow of Luxury
          </h1>
          <p className="mt-3 sm:mt-4 md:mt-5 text-gray-200 text-base sm:text-lg md:text-xl lg:text-2xl max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl">
            Explore exclusive chandeliers, pendant lights, and designer fixtures crafted for elegance.
          </p>
        </div>
      </section>

      {/* Explore More Button - Responsive */}
      <div className="flex justify-center mt-8 sm:mt-10 mb-12 sm:mb-16 px-4">
        <button className="bg-black text-white hover:bg-white hover:text-black font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-sm sm:text-base">
          Explore More
        </button>
      </div>
    </>
  );
}

export default LuxuryLightShop;

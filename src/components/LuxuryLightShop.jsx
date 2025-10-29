import React from 'react';
import generatedVideo from '../assets/generated-video.mp4';

function LuxuryLightShop() {
  return (
    <>
      <section className="relative w-full min-h-screen">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={generatedVideo}
        ></video>

        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
          <h1 className="text-5xl md:text-10xl font-bold text-red-200 drop-shadow-lg">
            Discover the Glow of Luxury
          </h1>
          <p className="mt-4 text-gray-200 text-lg md:text-xl max-w-2xl">
            Explore exclusive chandeliers, pendant lights, and designer fixtures crafted for elegance.
          </p>
        </div>
      </section>

      {/* Button below video section */}
      <div className="flex justify-center mt-10">
        <button className="bg-black hover:bg-white text-white hover:text-black font-semibold py-2 px-9  shadow-lg transition focus:outline-none focus:ring-4 focus:ring-black-300">
          Explore More
        </button>
      </div>
    </>
  );
}

export default LuxuryLightShop;

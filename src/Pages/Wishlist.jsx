// src/Pages/Wishlist.jsx
import React from "react";

function Wishlist() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  return (
    <section className="py-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-5">
        <h1 className="text-3xl font-bold text-yellow-600 mb-8 text-center">
          My Wishlist 💖
        </h1>

        {wishlist.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No items added to your wishlist yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md p-5 text-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-60 object-cover rounded-lg mb-3"
                />
                <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                <p className="text-yellow-500 font-semibold mt-1">${item.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Wishlist;

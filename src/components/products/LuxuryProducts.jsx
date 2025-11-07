import React from "react";
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Crystal Chandelier",
    category: "Chandeliers",
    description: "Elegant crystal chandelier with gold finish and warm glow.",
    image: "https://i5.walmartimages.com/seo/FINE-MAKER-Luxury-Crystal-Chandelier-Pendant-Light-Gold-Finish-Ceiling-Hanging-Light-Fixture-for-Living-Room-Hallway-Foyer-15-Light-23_265dcead-11fb-43ed-a799-9675b0dd1024.6635ddcea86a563a27195b236c8126de.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
  },
  {
    id: 2,
    name: "Modern Pendant Light",
    category: "Pendant",
    description: "Minimalist design with matte black body and LED lighting.",
    image: "https://static.vecteezy.com/system/resources/thumbnails/019/946/978/small/ceiling-light-bulbs-vintage-lamp-bulb-decorative-in-home-photo.jpg",
  },
  {
    id: 3,
    name: "Wall Sconce Lamp",
    category: "Ceiling Light",
    description: "Soft wall-mounted light with brass finish for classic interiors.",
    image: "https://flyachilles.com/cdn/shop/files/brass-vintage-wall-sconce-light-retro-luxury-stairwell-wall-lamp-149163.jpg?v=1721729694&width=1500",
  },
  {
    id: 4,
    name: "Luxury Floor Lamp",
    category: "Floor Light",
    description: "Contemporary tall lamp with marble base and ambient shade.",
    image: "https://cdn11.bigcommerce.com/s-0z4jan/images/stencil/1280x1280/products/1372/6901/baroque_floor_lamp_3__13570.1441079846.jpg?c=2",
  },
];

const LuxuryProducts = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    // Navigate to products page with category filter
    navigate(`/products?category=${category}`);
  };

  return (
    <section  className="min-h-screen py-6 px-2" id="products">
      <div className="text-center mb-10 sm:mb-12 md:mb-16 px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black-400 mb-3">
          Shop by Categories
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-6 max-w-7xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleCategoryClick(product.category)}
            className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 hover:border-yellow-400 cursor-pointer"
          >
            {/* Image Container with Overlay */}
            <div className="relative overflow-hidden h-56 sm:h-64">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6 bg-gradient-to-b from-white to-gray-50">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                {product.name}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                {product.description}
              </p>
              
              {/* Decorative Element */}
              <div className="mt-4 flex items-center gap-2">
                <div className="w-8 h-0.5 bg-yellow-400 group-hover:w-16 transition-all duration-300"></div>
                <span className="text-xs font-semibold text-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View Category
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LuxuryProducts;

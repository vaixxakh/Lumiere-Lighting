import React from "react";

const products = [
  {
    id: 1,
    name: "Crystal Chandelier",
    description: "Elegant crystal chandelier with gold finish and warm glow.",
    image: "https://i5.walmartimages.com/seo/FINE-MAKER-Luxury-Crystal-Chandelier-Pendant-Light-Gold-Finish-Ceiling-Hanging-Light-Fixture-for-Living-Room-Hallway-Foyer-15-Light-23_265dcead-11fb-43ed-a799-9675b0dd1024.6635ddcea86a563a27195b236c8126de.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
  },
  {
    id: 2,
    name: "Modern Pendant Light",
    description: "Minimalist design with matte black body and LED lighting.",
    image: "https://static.vecteezy.com/system/resources/thumbnails/019/946/978/small/ceiling-light-bulbs-vintage-lamp-bulb-decorative-in-home-photo.jpg",
  },
  {
    id: 3,
    name: "Wall Sconce Lamp",
    description: "Soft wall-mounted light with brass finish for classic interiors.",
    image: "https://flyachilles.com/cdn/shop/files/brass-vintage-wall-sconce-light-retro-luxury-stairwell-wall-lamp-149163.jpg?v=1721729694&width=1500",
  },
  {
    id: 4,
    name: "Luxury Floor Lamp",
    description: "Contemporary tall lamp with marble base and ambient shade.",
    image: "https://cdn11.bigcommerce.com/s-0z4jan/images/stencil/1280x1280/products/1372/6901/baroque_floor_lamp_3__13570.1441079846.jpg?c=2",
  },
];

const LuxuryProducts = () => {
  return (
    <section className="py-27  bg-gray-100" id="products">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800" >Shop by Categories</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-transform hover:-translate-y-1"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-5">
              <h3 className="text-2xl font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600 mt-2 text-sm">{product.description}</p>
            </div>
           
          </div>
        ))}
       
        
      </div>
    </section>
  );
};

export default LuxuryProducts;
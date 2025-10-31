import React from 'react'

function Footer() {
  return (
    <div>
        <footer className="bg-gray-900 text-gray-200 py-10 mt-20">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
    {/* About / Brand Info */}
    <div>
      <h2 className="text-xl font-semibold mb-4">Lumiere</h2>
      <p className="text-gray-400">
        Luxurious lighting solutions crafted for elegance and sophistication. Illuminate your space with style.
      </p>
    </div>
    {/* Quick Links */}
    <div>
      <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
      <ul className="space-y-2">
        <li><a href="#home" className="hover:text-yellow-400">Home</a></li>
        <li><a href="#collections" className="hover:text-yellow-400">Collections</a></li>
        <li><a href="#about" className="hover:text-yellow-400">About Us</a></li>
        <li><a href="#contact" className="hover:text-yellow-400">Contact</a></li>
      </ul>
    </div>
    {/* Contact Info */}
    <div>
      <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
      <p className="text-gray-400 mb-2">Lumiere Luxe Lighting Pvt Limited
        4th Floor, Coastal Business Centre,
        MG Road, Ernakulam,</p>
      <p className="text-gray-400 mb-2">Email:info@lumiereluxe.in</p>
      <p className="text-gray-400">Phone: +91  484 400 1234</p>
    </div>
    {/* Social Media */}
    <div>
      <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
      <div className="flex space-x-4">
        <a href="#" className="hover:text-yellow-400">Facebook</a>
        <a href="#" className="hover:text-yellow-400">Instagram</a>
        <a href="#" className="hover:text-yellow-400">LinkedIn</a>
      </div>
    </div>
  </div>
  {/* Bottom Line */}
  <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
    &copy; {new Date().getFullYear()} Lumiere. All rights reserved.
  </div>
</footer>

      
    </div>
  )
}

export default Footer
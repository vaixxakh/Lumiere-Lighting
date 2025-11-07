import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter, Heart, ArrowUp } from 'lucide-react';

function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [scrollTop, setScrollTop] = useState(false);

  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show scroll to top button
  React.useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-6 mb-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <Link to="/" className="block mb-4 group">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:to-yellow-500 transition-all">
                Lumiere
              </h2>
              <p className="text-xs text-yellow-400 font-semibold mt-1">Luxury Lighting</p>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Luxurious lighting solutions crafted for elegance and sophistication. Illuminate your space with style and brilliance.
            </p>
            <div className="mt-4 flex gap-2">
              <Heart size={16} className="text-yellow-400" />
              <span className="text-xs text-gray-400">Handcrafted with passion</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg sm:text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm sm:text-base flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm sm:text-base flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm sm:text-base flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm sm:text-base flex items-center gap-2 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg sm:text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    4th Floor, Coastal Business Centre,
                    MG Road, Ernakulam, Kerala 682016
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <a 
                  href="mailto:info@lumiereluxe.in" 
                  className="text-xs sm:text-sm text-gray-400 hover:text-yellow-400 transition-colors break-all"
                >
                  info@lumiereluxe.in
                </a>
              </div>
              <div className="flex gap-3">
                <Phone size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <a 
                  href="tel:+914844001234" 
                  className="text-xs sm:text-sm text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  +91 484 400 1234
                </a>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg sm:text-base font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
              Follow Us
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              <a 
                href="https://facebook.com/lumiereluxe" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 hover:bg-gray-800 px-3 py-2 rounded-lg transition-all duration-300 text-sm"
              >
                <Facebook size={16} />
                <span className="hidden sm:inline">Facebook</span>
              </a>
              <a 
                href="https://instagram.com/lumiereluxe" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 hover:bg-gray-800 px-3 py-2 rounded-lg transition-all duration-300 text-sm"
              >
                <Instagram size={16} />
                <span className="hidden sm:inline">Instagram</span>
              </a>
              <a 
                href="https://linkedin.com/company/lumiereluxe" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 hover:bg-gray-800 px-3 py-2 rounded-lg transition-all duration-300 text-sm"
              >
                <Linkedin size={16} />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
              <a 
                href="https://twitter.com/lumiereluxe" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 hover:bg-gray-800 px-3 py-2 rounded-lg transition-all duration-300 text-sm"
              >
                <Twitter size={16} />
                <span className="hidden sm:inline">Twitter</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-500">
          <div className="text-center sm:text-left">
            <p>&copy; {currentYear} Lumiere Luxe Lighting Pvt Limited. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {scrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </footer>
  );
}

export default Footer;

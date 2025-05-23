import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
const Footer = () => {
  return <footer className="bg-mathdark text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-mathprimary">
                <GraduationCap size={24} />
              </div>
              <span className="text-xl font-display font-bold">MathHub</span>
            </div>
            <p className="text-gray-300 max-w-xs">
              Your one-stop platform for accessing past math papers and practicing with our interactive exam simulations.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/boards" className="text-gray-300 hover:text-white transition-colors">Papers</Link>
              </li>
              <li>
                <Link to="/exams" className="text-gray-300 hover:text-white transition-colors">Practice Exams</Link>
              </li>
              <li>
                <Link to="/premium" className="text-gray-300 hover:text-white transition-colors">Premium</Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-gray-300 hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-gray-300 hover:text-white transition-colors">Refund Policy</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Boards</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/boards/icse" className="text-gray-300 hover:text-white transition-colors">ICSE</Link>
              </li>
              <li>
                <Link to="/boards/cbse" className="text-gray-300 hover:text-white transition-colors">CBSE</Link>
              </li>
              <li>
                <Link to="/boards/west-bengal" className="text-gray-300 hover:text-white transition-colors">West Bengal</Link>
              </li>
              <li>
                <Link to="/premium" className="text-mathaccent hover:text-white transition-colors"></Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              
              
              <li className="flex items-center space-x-2">
                <Mail size={18} className="shrink-0" />
                <span className="text-gray-300">admin@mathhub.online</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} MathHub. All rights reserved.</p>
        </div>
      </div>
    </footer>;
};
export default Footer;
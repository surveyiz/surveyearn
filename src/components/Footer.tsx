import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center mb-6">
                <ClipboardList className="h-7 w-7 text-primary-400" />
                <span className="ml-2 text-xl font-bold">BunnySurveys</span>
              </div>
              <p className="text-gray-400 mb-6">
                Earn money by participating in interesting surveys from our partners. Fast payments, user-friendly platform.
              </p>
              <div className="flex space-x-4">
                <a href="https://facebook.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="https://twitter.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="https://instagram.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="https://linkedin.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-primary-400">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
                </li>
                <li>
                  <Link to="/app/surveys" className="text-gray-400 hover:text-white transition-colors">Surveys</Link>
                </li>
                <li>
                  <Link to="/app/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                </li>
                <li>
                  <Link to="/app/referrals" className="text-gray-400 hover:text-white transition-colors">Referrals</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-primary-400">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6 text-primary-400">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Subscribe to get notifications about new surveys and offers.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 w-full bg-gray-800 text-white rounded-l-md border border-gray-700 focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 px-4 rounded-r-md flex items-center justify-center"
                >
                  <Mail size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} BunnySurveys. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
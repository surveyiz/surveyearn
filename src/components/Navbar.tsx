import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ClipboardList } from 'lucide-react';
import Button from './Button';
import { getCurrentUser } from '../utils/auth';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setHasScrolled(window.scrollY > 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleDashboardClick = () => {
    navigate('/app/dashboard');
  };

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false);
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Home', action: () => scrollToSection('hero') },
    { name: 'Features', action: () => scrollToSection('features') },
    { name: 'How It Works', action: () => scrollToSection('how-it-works') },
    { name: 'Testimonials', action: () => scrollToSection('testimonials') },
    { name: 'FAQ', action: () => scrollToSection('faq') },
    { name: 'Contact', action: () => scrollToSection('contact') },
  ];

  return (
    <nav className={`fixed w-full z-30 transition-all duration-300 ${
      hasScrolled ? 'bg-primary-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <ClipboardList className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-white">BunnySurveys</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={link.action}
                  className="px-3 py-2 text-sm font-medium text-white hover:text-primary-200 transition-colors"
                >
                  {link.name}
                </button>
              ))}
              {currentUser ? (
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={handleDashboardClick}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="text-white border-white hover:bg-white/10">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-primary-200 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className={`md:hidden ${
          hasScrolled ? 'bg-primary-900/95 backdrop-blur-md' : 'bg-black/50 backdrop-blur-md'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={link.action}
                className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:text-primary-200"
              >
                {link.name}
              </button>
            ))}
            <div className="flex space-x-2 mt-4 px-3 pb-4">
              {currentUser ? (
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={handleDashboardClick}
                  className="w-full bg-primary-600 hover:bg-primary-700"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-white border-white hover:bg-white/10">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" className="flex-1">
                    <Button variant="primary" size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
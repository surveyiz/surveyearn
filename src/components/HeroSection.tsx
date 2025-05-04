import React from 'react';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import HeroIllustration from '../assets/hero-illustration';
import { getCurrentUser } from '../utils/auth';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handlePrimaryAction = () => {
    if (currentUser) {
      navigate('/app/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleSecondaryAction = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-[calc(100vh-4rem)] flex items-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden px-4 py-12 sm:py-16 lg:py-20">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full bg-accent-500 opacity-20 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[1000px] h-[1000px] rounded-full bg-secondary-500 opacity-20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-white space-y-6 sm:space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="ml-2 text-xs sm:text-sm font-medium">Trusted by 10,000+ users</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Earn From Your
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-accent-300 to-secondary-300">
                Valuable Opinions
              </span>
            </h1>

            <h2 className="text-2xl sm:text-3xl font-medium text-white/90">
              Get up to <span className="text-accent-300">Ksh 300</span> per survey
            </h2>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-accent-400 flex-shrink-0" />
                <span className="text-base sm:text-lg text-white/90">Free and easy to Join</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-accent-400 flex-shrink-0" />
                <span className="text-base sm:text-lg text-white/90">Earn and have fun</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-accent-400 flex-shrink-0" />
                <span className="text-base sm:text-lg text-white/90">Quick payouts via M-Pesa</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={handlePrimaryAction}
                className="group bg-accent-500 hover:bg-accent-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
              >
                {currentUser ? 'Go to Dashboard' : 'Start Earning Now'}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleSecondaryAction}
                className="border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>

            <div className="pt-6 sm:pt-8 grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8">
              <div>
                <div className="text-2xl sm:text-3xl font-bold">10K+</div>
                <div className="text-sm sm:text-base text-white/70">Active Users</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/20" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold">50K+</div>
                <div className="text-sm sm:text-base text-white/70">Surveys Done</div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/20" />
              <div>
                <div className="text-2xl sm:text-3xl font-bold">2M+</div>
                <div className="text-sm sm:text-base text-white/70">Paid Out</div>
              </div>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-500 to-secondary-500 rounded-3xl blur-3xl opacity-30 transform rotate-3" />
            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-4 sm:p-8 border border-white/20">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
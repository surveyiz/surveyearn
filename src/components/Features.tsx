import React from 'react';
import { Timer, BellRing, Navigation, TrendingUp } from 'lucide-react';
import { features } from '../data/homeData';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

const Features: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/app/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'timer':
        return <Timer size={32} className="text-white" />;
      case 'bell-ring':
        return <BellRing size={32} className="text-white" />;
      case 'navigation':
        return <Navigation size={32} className="text-white" />;
      case 'trending-up':
        return <TrendingUp size={32} className="text-white" />;
      default:
        return null;
    }
  };

  return (
    <section className="py-20" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Features</h2>
          <p className="mt-4 text-lg text-gray-600">
            What makes BunnySurveys stand out
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="group relative h-[340px] bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative h-full p-8 flex flex-col transition-all duration-500 group-hover:translate-y-0">
                <div className="mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  {getIcon(feature.icon)}
                </div>
                
                <div className="flex-1 transition-colors duration-500">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-white/90">
                    {feature.description}
                  </p>
                </div>
                
                <div className="absolute bottom-4 right-4 text-8xl font-bold opacity-5 group-hover:opacity-10 transition-opacity duration-500 select-none">
                  {index + 1}
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-200 to-accent-200 rounded-bl-[100%] opacity-20 group-hover:opacity-30 transition-all duration-500 transform group-hover:scale-110" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent-200 to-primary-200 rounded-tr-[100%] opacity-20 group-hover:opacity-30 transition-all duration-500 transform group-hover:scale-110" />
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button 
            onClick={handleGetStarted}
            className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {currentUser ? 'Go to Dashboard' : 'Get Started Now'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
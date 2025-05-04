import React from 'react';
import { UserPlus, ClipboardList, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { steps } from '../data/homeData';
import { getCurrentUser } from '../utils/auth';

const HowItWorks: React.FC = () => {
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
      case 'user-plus':
        return <UserPlus size={32} className="text-white" />;
      case 'clipboard-list':
        return <ClipboardList size={32} className="text-white" />;
      case 'banknote':
        return <Banknote size={32} className="text-white" />;
      default:
        return null;
    }
  };

  return (
    <section className="py-20 bg-gray-50" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            How to earn money with SurveyPlus online surveys?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative h-full"
            >
              {index !== steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 transform -translate-y-1/2 z-0" />
              )}
              <div className="relative bg-gradient-to-br from-primary-600 to-accent-500 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 z-10 h-[320px] flex flex-col">
                <div className="absolute top-0 right-0 text-8xl font-bold opacity-5 select-none">
                  {step.id}
                </div>
                <div className="flex flex-col items-center flex-1">
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm">
                    {getIcon(step.icon)}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-white/90 text-center flex-1 flex items-center">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleGetStarted}
            className="px-8 py-4 text-lg bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {currentUser ? 'Go to Dashboard' : 'Start Earning Now'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
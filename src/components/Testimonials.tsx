import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { testimonials } from '../data/homeData';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser } from '../utils/auth';

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const nextTestimonial = () => {
    setDirection(1);
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleJoinCommunity = () => {
    if (currentUser) {
      navigate('/app/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section className="py-20 relative overflow-hidden" id="testimonials">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">What Our Users Say</h2>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of satisfied users earning from surveys
          </p>
        </div>

        <div className="relative">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-br-full" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary-500/20 to-accent-500/20 rounded-tl-full" />
              
              <div className="relative px-6 py-12 sm:px-12">
                <Quote className="absolute top-6 left-6 w-12 h-12 text-primary-500/20" />
                
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-6">
                      <User size={48} className="text-primary-600" />
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                      {renderStars(testimonials[activeIndex].rating)}
                    </div>
                    
                    <blockquote className="text-center mb-6">
                      <p className="text-lg sm:text-xl text-gray-700 italic">
                        "{testimonials[activeIndex].feedback}"
                      </p>
                    </blockquote>
                    
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {testimonials[activeIndex].name}
                      </h3>
                      <p className="text-primary-600 font-medium">
                        {testimonials[activeIndex].role}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center px-4">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 transform hover:scale-110"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 transform hover:scale-110"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > activeIndex ? 1 : -1);
                  setActiveIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'w-6 bg-primary-600' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={handleJoinCommunity}
            className="inline-flex items-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-primary-600 to-accent-500 hover:from-primary-700 hover:to-accent-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {currentUser ? 'Go to Dashboard' : 'Join Our Community'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
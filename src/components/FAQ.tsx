import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { faqs } from '../data/homeData';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser } from '../utils/auth';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSignUp = () => {
    if (currentUser) {
      navigate('/app/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="py-20 bg-gray-50" id="faq">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Welcome to our help center! Here you can find answers to questions frequently asked by our users.
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-gray-200 rounded-xl overflow-hidden shadow-md bg-white">
          {faqs.map((faq, index) => (
            <div key={faq.id} className="group">
              <button
                className={`w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none ${
                  openIndex === index ? 'bg-primary-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index}
              >
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                <span className="ml-6 flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="h-6 w-6 text-primary-500" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-gray-500" />
                  )}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-base text-gray-700">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={handleSignUp}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            {currentUser ? 'Go to Dashboard' : 'Sign Up for Free'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
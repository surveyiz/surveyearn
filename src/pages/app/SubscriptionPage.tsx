import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Check, Loader, Crown, ArrowRight } from 'lucide-react';

interface SurveyPlan {
  planName: string;
  dailySurvey: number;
  monthlyIncome: number;
  dailyIncome: number;
  minimumWithdrawal: number;
  earningPerSurvey: string;
  price: string;
}

interface PackagesResponse {
  surveyPlans: SurveyPlan[];
  mpesaPaymentDetails: {
    tillName: string;
    tillNumber: number;
  };
}

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PackagesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SurveyPlan | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get<PackagesResponse>('https://derekkemoi.github.io/SURVEYPLUS/packages.json');
        setPackages(response.data);
      } catch (err) {
        setError('Failed to load subscription packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleSelectPlan = (plan: SurveyPlan) => {
    setSelectedPlan(plan);
    // Store selected plan in localStorage
    localStorage.setItem('selectedPlan', JSON.stringify({
      ...plan,
      activatedAt: new Date().toISOString(),
    }));
    navigate('/app/payment', { state: { plan } });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading subscription packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="mt-4 text-lg text-gray-600">
          Select a subscription plan that best fits your needs
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-4 sm:grid-cols-2">
        {packages?.surveyPlans.map((plan) => (
          <div
            key={plan.planName}
            className={`relative flex flex-col rounded-2xl border ${
              plan.planName === 'Business Premium' 
                ? 'border-primary-400 bg-primary-50' 
                : 'border-gray-200 bg-white'
            } p-8 shadow-sm hover:border-primary-400 hover:shadow-lg transition-all duration-300`}
          >
            {plan.planName === 'Business Premium' && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-600 to-accent-500 px-4 py-1 text-sm font-semibold text-white">
                Popular
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">{plan.planName}</h3>
                <Crown className={`w-6 h-6 ${
                  plan.planName === 'Free Account' ? 'text-gray-400' : 'text-yellow-500'
                }`} />
              </div>

              <p className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  Ksh {plan.price}
                </span>
                {plan.price !== "0" && (
                  <span className="ml-1 text-sm font-semibold text-gray-600">/month</span>
                )}
              </p>

              <ul className="mt-6 space-y-4">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-primary-600" />
                  <span className="ml-3 text-gray-700">{plan.dailySurvey} surveys per day</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-primary-600" />
                  <span className="ml-3 text-gray-700">
                    Ksh {plan.monthlyIncome.toLocaleString()} monthly income
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-primary-600" />
                  <span className="ml-3 text-gray-700">
                    Ksh {plan.dailyIncome.toLocaleString()} daily income
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-primary-600" />
                  <span className="ml-3 text-gray-700">
                    Ksh {plan.minimumWithdrawal.toLocaleString()} min. withdrawal
                  </span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-primary-600" />
                  <span className="ml-3 text-gray-700">
                    Ksh {plan.earningPerSurvey} per survey
                  </span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan(plan)}
              className={`mt-8 w-full rounded-lg px-4 py-3 text-center font-semibold ${
                plan.planName === 'Business Premium'
                  ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white hover:from-primary-700 hover:to-accent-600'
                  : plan.planName === 'Free Account'
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              } transition-colors flex items-center justify-center space-x-2`}
            >
              <span>Select Plan</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
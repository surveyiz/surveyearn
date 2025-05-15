import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, CheckCircle, Smartphone } from 'lucide-react';

interface PackagesResponse {
  surveyPlans: Array<{
    planName: string;
    minimumWithdrawal: number;
  }>;
}

const WithdrawalPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [minimumWithdrawal, setMinimumWithdrawal] = useState(3000); // Default minimum for free users
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current balance
        const earnings = JSON.parse(localStorage.getItem('earnings') || '[]');
        const totalEarnings = earnings.reduce((sum: number, earning: { amount: number }) => sum + earning.amount, 0);
        setCurrentBalance(totalEarnings);

        // Get user's subscription and minimum withdrawal amount
        const response = await axios.get<PackagesResponse>('https://derekkemoi.github.io/SURVEYPLUS/packages.json');
        const subscription = JSON.parse(localStorage.getItem('subscription') || '{}');
        
        if (subscription?.plan?.planName) {
          const plan = response.data.surveyPlans.find(p => p.planName === subscription.plan.planName);
          if (plan) {
            setMinimumWithdrawal(plan.minimumWithdrawal);
          }
        }

        // Get saved phone number
        const paymentMethods = JSON.parse(localStorage.getItem('paymentMethods') || '{}');
        if (paymentMethods.mpesa) {
          setPhoneNumber(paymentMethods.mpesa);
        }
      } catch (err) {
        setError('Failed to load withdrawal information');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWithdraw = async () => {
    if (!phoneNumber) {
      setError('Please add your M-PESA number in settings first');
      return;
    }

    if (currentBalance < minimumWithdrawal) {
      setError(`Minimum withdrawal amount is Ksh ${minimumWithdrawal}. Please earn more to withdraw.`);
      return;
    }

    setProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear earnings after successful withdrawal
      localStorage.setItem('earnings', '[]');
      
      // Navigate to dashboard
      navigate('/app/dashboard');
    } catch (err) {
      setError('Withdrawal failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Loading withdrawal information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Withdraw Funds</h1>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Current Balance</p>
              <p className="text-2xl font-bold text-gray-900">Ksh {currentBalance}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Minimum Withdrawal</p>
              <p className="text-2xl font-bold text-gray-900">Ksh {minimumWithdrawal}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Smartphone className="w-5 h-5 text-blue-500 mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-blue-900">M-PESA Payment</h3>
                <p className="mt-1 text-sm text-blue-800">
                  {phoneNumber ? (
                    <>Funds will be sent to {phoneNumber}</>
                  ) : (
                    <>Please add your M-PESA number in settings first</>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleWithdraw}
              disabled={processing || currentBalance < minimumWithdrawal}
              className={`px-4 py-2 rounded-lg text-white flex items-center ${
                processing || currentBalance < minimumWithdrawal
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Withdraw Funds'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawalPage;
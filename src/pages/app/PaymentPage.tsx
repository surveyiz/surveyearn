import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Copy, CheckCircle, X, Smartphone, AlertCircle } from 'lucide-react';

interface PaymentDetails {
  tillName: string;
  tillNumber: number;
}

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [mpesaMessage, setMpesaMessage] = useState('');
  const [validationError, setValidationError] = useState('');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const plan = location.state?.plan;

  useEffect(() => {
    if (!plan) {
      navigate('/app/subscription');
      return;
    }

    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get('https://derekkemoi.github.io/SURVEYPLUS/packages.json');
        setPaymentDetails(response.data.mpesaPaymentDetails);
      } catch (err) {
        console.error('Failed to load payment details');
      }
    };

    fetchPaymentDetails();
  }, [plan, navigate]);

  const copyTillNumber = () => {
    if (paymentDetails) {
      navigator.clipboard.writeText(paymentDetails.tillNumber.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const validatePayment = () => {
    if (!mpesaMessage) {
      setValidationError('Please enter the M-PESA message');
      return;
    }

    const messageLC = mpesaMessage.toLowerCase();
    const tillNameLC = paymentDetails?.tillName.toLowerCase() || '';
    const amount = plan.price;

    if (!messageLC.includes(tillNameLC) || !messageLC.includes(amount)) {
      setValidationError('Invalid M-PESA message. Please check and try again.');
      return;
    }

    // Save subscription details
    const subscriptionDetails = {
      plan: plan,
      activatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      surveysRemaining: plan.dailySurvey * 30, // Monthly survey limit
      lastResetDate: new Date().toISOString()
    };
    
    localStorage.setItem('subscription', JSON.stringify(subscriptionDetails));
    navigate('/app/surveys');
  };

  if (!plan || !paymentDetails) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-primary-600 to-accent-500">
          <h1 className="text-2xl font-bold text-white">Complete Your Payment</h1>
          <p className="mt-2 text-white/90">Follow the steps below to activate your subscription</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
            <div>
              <p className="text-sm text-primary-600 font-medium">Selected Plan</p>
              <p className="text-lg font-semibold text-gray-900">{plan.planName}</p>
            </div>
            <div>
              <p className="text-sm text-primary-600 font-medium">Amount</p>
              <p className="text-lg font-semibold text-gray-900">Ksh {plan.price}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Payment Instructions</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">1</span>
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">Go to your M-PESA menu</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">2</span>
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">Select "Lipa na M-PESA"</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">3</span>
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">Select "Buy Goods and Services"</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">4</span>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-gray-700">Enter Till Number:</p>
                  <div className="mt-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-mono text-lg font-semibold text-gray-900">
                      {paymentDetails.tillNumber}
                    </span>
                    <button
                      onClick={copyTillNumber}
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                    >
                      {copied ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                      <span className="text-sm font-medium">
                        {copied ? 'Copied!' : 'Copy'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">5</span>
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">Enter amount: <span className="font-semibold">Ksh {plan.price}</span></p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold">6</span>
                </div>
                <div className="ml-4">
                  <p className="text-gray-700">Enter your M-PESA PIN and confirm payment</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => setShowValidationModal(true)}
              className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Smartphone className="w-5 h-5" />
              <span>I've Made the Payment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Payment Validation Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Validate Payment</h3>
              <button onClick={() => setShowValidationModal(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {validationError && (
              <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 flex items-center text-red-700">
                <AlertCircle className="w-5 h-5 mr-2" />
                {validationError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paste M-PESA Message
                </label>
                <textarea
                  value={mpesaMessage}
                  onChange={(e) => setMpesaMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={4}
                  placeholder="Paste the full M-PESA message here..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowValidationModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={validatePayment}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Validate Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipboardList, DollarSign, AlertCircle, Loader, Crown, Lock, X } from 'lucide-react';

interface SurveyQuestion {
  surveyQuestion: string;
  surveyType: number;
  surveyAnswers: string[];
}

interface Survey {
  surveyId: string;
  surveyCategory: string;
  surveyPaid: boolean;
  surveyAmount: number;
  surveyQuestions: SurveyQuestion[];
}

interface SurveysResponse {
  surveyTag: string;
  surveys: Survey[];
}

interface Subscription {
  plan: {
    planName: string;
    dailySurvey: number;
  };
  activatedAt: string;
  expiresAt: string;
  lastResetDate: string;
}

const SurveysPage: React.FC = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [dailySurveysRemaining, setDailySurveysRemaining] = useState<number>(0);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await axios.get<SurveysResponse>('https://derekkemoi.github.io/SURVEYPLUS/surveys.json');
        const completedSurveys = JSON.parse(localStorage.getItem('completedSurveys') || '[]');
        const availableSurveys = response.data.surveys.filter(
          survey => !completedSurveys.includes(survey.surveyId)
        );
        setSurveys(availableSurveys);
      } catch (err) {
        setError('Failed to load surveys. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  useEffect(() => {
    const checkDailySurveyLimit = () => {
      const subscriptionStr = localStorage.getItem('subscription');
      if (!subscriptionStr) {
        // Free user gets 1 survey per day
        const completedToday = getCompletedSurveysToday();
        setDailySurveysRemaining(Math.max(0, 1 - completedToday));
        return;
      }

      const subscription: Subscription = JSON.parse(subscriptionStr);
      const today = new Date().toISOString().split('T')[0];
      const lastReset = new Date(subscription.lastResetDate).toISOString().split('T')[0];

      if (today !== lastReset) {
        // Reset daily survey count
        subscription.lastResetDate = new Date().toISOString();
        localStorage.setItem('subscription', JSON.stringify(subscription));
        setDailySurveysRemaining(subscription.plan.dailySurvey);
      } else {
        const completedToday = getCompletedSurveysToday();
        setDailySurveysRemaining(Math.max(0, subscription.plan.dailySurvey - completedToday));
      }
    };

    checkDailySurveyLimit();
  }, []);

  const getCompletedSurveysToday = () => {
    const completedSurveys = JSON.parse(localStorage.getItem('completedSurveys') || '[]');
    const earnings = JSON.parse(localStorage.getItem('earnings') || '[]');
    const today = new Date().toISOString().split('T')[0];

    return earnings.filter((earning: any) => {
      const earningDate = new Date(earning.date).toISOString().split('T')[0];
      return earningDate === today && earning.surveyId !== "1"; // Don't count system survey
    }).length;
  };

  const handleTakeSurvey = (survey: Survey) => {
    // System survey (ID: 1) is always available
    if (survey.surveyId === "1") {
      navigate(`/app/surveys/${survey.surveyId}`);
      return;
    }

    // Check daily survey limit
    if (dailySurveysRemaining <= 0) {
      setSelectedSurvey(survey);
      setShowLimitModal(true);
      return;
    }

    if (survey.surveyPaid) {
      const subscription = localStorage.getItem('subscription');
      if (!subscription) {
        setSelectedSurvey(survey);
        setShowSubscriptionModal(true);
        return;
      }
    }

    navigate(`/app/surveys/${survey.surveyId}`);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading available surveys...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4 mx-auto" />
          <p className="text-gray-900 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Surveys</h1>
          <p className="text-gray-600 mt-1">Complete surveys and earn rewards</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Crown className="w-4 h-4 text-yellow-500" />
            <span className="text-gray-600">Paid Survey</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Crown className="w-4 h-4 text-gray-300" />
            <span className="text-gray-600">Free Survey</span>
          </div>
        </div>
      </div>

      {surveys.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Surveys Available</h3>
          <p className="text-gray-600">
            You've completed all available surveys. Check back later for new opportunities!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey) => (
            <div
              key={survey.surveyId}
              className={`group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border ${
                survey.surveyId === "1" 
                  ? 'border-green-200 bg-green-50'
                  : survey.surveyPaid 
                    ? 'border-yellow-200' 
                    : 'border-gray-100'
              } overflow-hidden`}
            >
              {survey.surveyId === "1" && (
                <div className="bg-green-100 px-4 py-2 flex items-center">
                  <AlertCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm text-green-700">System Survey - Always Available</span>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      survey.surveyId === "1"
                        ? 'bg-green-100'
                        : survey.surveyPaid 
                          ? 'bg-yellow-100' 
                          : 'bg-gray-100'
                    }`}>
                      <ClipboardList className={`w-6 h-6 ${
                        survey.surveyId === "1"
                          ? 'text-green-600'
                          : survey.surveyPaid 
                            ? 'text-yellow-600' 
                            : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {survey.surveyCategory}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {survey.surveyQuestions.length} questions
                      </p>
                    </div>
                  </div>
                  <Crown 
                    className={`w-6 h-6 ${
                      survey.surveyId === "1"
                        ? 'text-green-500'
                        : survey.surveyPaid 
                          ? 'text-yellow-500' 
                          : 'text-gray-300'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center text-gray-900">
                    <DollarSign className={`w-5 h-5 mr-1 ${
                      survey.surveyId === "1"
                        ? 'text-green-500'
                        : survey.surveyPaid 
                          ? 'text-yellow-500' 
                          : 'text-gray-400'
                    }`} />
                    <span className={`font-semibold ${
                      survey.surveyId === "1"
                        ? 'text-green-700'
                        : survey.surveyPaid 
                          ? 'text-gray-900' 
                          : 'text-gray-500'
                    }`}>
                      Ksh {survey.surveyAmount}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleTakeSurvey(survey)}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      survey.surveyId === "1"
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : survey.surveyPaid 
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Take Survey
                  </button>
                </div>
              </div>

              <div className={`px-6 py-4 ${
                survey.surveyId === "1"
                  ? 'bg-green-50 border-t border-green-100'
                  : survey.surveyPaid 
                    ? 'bg-yellow-50 border-t border-yellow-100'
                    : 'bg-gray-50 border-t border-gray-100'
              }`}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Estimated time:</span>
                  <span className="text-gray-900 font-medium">
                    {Math.ceil(survey.surveyQuestions.length * 1.5)} mins
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Subscription Modal */}
      {showSubscriptionModal && selectedSurvey && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Paid Survey</h3>
              <button onClick={() => setShowSubscriptionModal(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="text-center mb-8">
              <Lock className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Subscribe to Access Paid Surveys
              </h4>
              <p className="text-gray-600">
                This is a paid survey worth Ksh {selectedSurvey.surveyAmount}. Subscribe to a plan to start earning from paid surveys.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSubscriptionModal(false);
                  navigate('/app/subscription');
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                View Subscription Plans
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Limit Modal */}
      {showLimitModal && selectedSurvey && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Daily Limit Reached</h3>
              <button onClick={() => setShowLimitModal(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="text-center mb-8">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                You've Reached Your Daily Survey Limit
              </h4>
              <p className="text-gray-600">
                Upgrade your plan to take more surveys per day and increase your earning potential.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLimitModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLimitModal(false);
                  navigate('/app/subscription');
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveysPage;
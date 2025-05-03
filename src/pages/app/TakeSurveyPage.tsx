import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';
import axios from 'axios';

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

const TakeSurveyPage: React.FC = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [currentStep, setCurrentStep] = useState<'instructions' | 'survey' | 'completion'>('instructions');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [timer, setTimer] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await axios.get('https://derekkemoi.github.io/SURVEYPLUS/surveys.json');
        const foundSurvey = response.data.surveys.find((s: Survey) => s.surveyId === surveyId);
        if (foundSurvey) {
          setSurvey(foundSurvey);
        } else {
          setError('Survey not found');
        }
      } catch (err) {
        setError('Failed to load survey');
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [surveyId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStep === 'survey' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, currentStep]);

  useEffect(() => {
    if (currentStep === 'survey') {
      setTimer(7);
    }
  }, [currentQuestionIndex, currentStep]);

  const handleStartSurvey = () => {
    setCurrentStep('survey');
  };

  const handleAnswer = (answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
  };

  const handleNext = () => {
    if (!survey) return;

    if (currentQuestionIndex < survey.surveyQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Save completed survey
      const completedSurveys = JSON.parse(localStorage.getItem('completedSurveys') || '[]');
      completedSurveys.push(survey.surveyId);
      localStorage.setItem('completedSurveys', JSON.stringify(completedSurveys));

      // Save earnings
      const earnings = JSON.parse(localStorage.getItem('earnings') || '[]');
      earnings.push({
        surveyId: survey.surveyId,
        amount: survey.surveyAmount,
        date: new Date().toISOString()
      });
      localStorage.setItem('earnings', JSON.stringify(earnings));

      setCurrentStep('completion');
    }
  };

  const handleFinish = () => {
    navigate('/app/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4 mx-auto" />
          <p className="text-gray-900 font-medium">{error}</p>
          <button
            onClick={() => navigate('/app/surveys')}
            className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
          >
            Back to Surveys
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'instructions') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">
              {survey.surveyCategory}
            </h1>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h2 className="text-lg font-medium text-blue-900 mb-2">
                  Important Instructions
                </h2>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Please do not leave or refresh the page until you complete the survey</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Take your time to read each question carefully</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>You must wait 7 seconds before proceeding to the next question</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Answer honestly and to the best of your knowledge</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Reward Amount</p>
                  <p className="text-xl font-bold text-gray-900">Ksh {survey.surveyAmount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Time</p>
                  <p className="text-xl font-bold text-gray-900">
                    {Math.ceil(survey.surveyQuestions.length * 1.5)} mins
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Questions</p>
                  <p className="text-xl font-bold text-gray-900">
                    {survey.surveyQuestions.length}
                  </p>
                </div>
              </div>

              <button
                onClick={handleStartSurvey}
                className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                Start Survey
                <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'completion') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-center p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Congratulations!
          </h2>
          <p className="text-gray-600 mb-6">
            You've successfully completed the survey and earned Ksh {survey.surveyAmount}
          </p>
          <button
            onClick={handleFinish}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = survey.surveyQuestions[currentQuestionIndex];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-gray-900 font-medium">{timer}s</span>
            </div>
            <div className="text-gray-600">
              Question {currentQuestionIndex + 1} of {survey.surveyQuestions.length}
            </div>
          </div>
          <div className="text-primary-600 font-medium">
            Ksh {survey.surveyAmount}
          </div>
        </div>
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-primary-600 transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / survey.surveyQuestions.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {currentQuestion.surveyQuestion}
          </h2>

          <div className="space-y-4">
            {currentQuestion.surveyType === 1 && (
              // Radio buttons for single choice
              <div className="space-y-3">
                {currentQuestion.surveyAnswers.map((answer, index) => (
                  <label
                    key={index}
                    className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={answer}
                      checked={answers[currentQuestionIndex] === answer}
                      onChange={() => handleAnswer(answer)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <span className="ml-3">{answer}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.surveyType === 2 && (
              // Text input for open-ended questions
              <textarea
                value={answers[currentQuestionIndex] as string || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full p-4 border rounded-lg focus:ring-primary-500 focus:border-primary-500"
                rows={4}
                placeholder="Type your answer here..."
              />
            )}

            {currentQuestion.surveyType === 3 && (
              // Checkboxes for multiple choice
              <div className="space-y-3">
                {currentQuestion.surveyAnswers.map((answer, index) => (
                  <label
                    key={index}
                    className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      value={answer}
                      checked={(answers[currentQuestionIndex] as string[] || []).includes(answer)}
                      onChange={(e) => {
                        const currentAnswers = answers[currentQuestionIndex] as string[] || [];
                        if (e.target.checked) {
                          handleAnswer([...currentAnswers, answer]);
                        } else {
                          handleAnswer(currentAnswers.filter(a => a !== answer));
                        }
                      }}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-3">{answer}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={handleNext}
            disabled={timer > 0 || !answers[currentQuestionIndex]}
            className={`px-6 py-3 rounded-lg flex items-center ${
              timer > 0 || !answers[currentQuestionIndex]
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {currentQuestionIndex < survey.surveyQuestions.length - 1 ? (
              <>
                Next Question
                <ChevronRight className="ml-2 w-5 h-5" />
              </>
            ) : (
              'Complete Survey'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeSurveyPage;
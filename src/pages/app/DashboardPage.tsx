import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  BarChart3,
  Settings,
  ClipboardList
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../utils/auth';

interface Earning {
  surveyId: string;
  amount: number;
  date: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [completedSurveys, setCompletedSurveys] = useState<string[]>([]);
  const [recentEarnings, setRecentEarnings] = useState<Earning[]>([]);
  const [hasPaymentMethod, setHasPaymentMethod] = useState(false);

  useEffect(() => {
    // Load completed surveys
    const completed = JSON.parse(localStorage.getItem('completedSurveys') || '[]');
    setCompletedSurveys(completed);

    // Load earnings
    const earnings = JSON.parse(localStorage.getItem('earnings') || '[]');
    setRecentEarnings(earnings);

    // Calculate total earnings
    const total = earnings.reduce((sum: number, earning: Earning) => sum + earning.amount, 0);
    setTotalEarnings(total);

    // Check payment method
    const paymentMethods = localStorage.getItem('paymentMethods');
    setHasPaymentMethod(!!paymentMethods);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name || 'User'}</p>
        </div>
        
        {/* Take Surveys CTA Button */}
        <button
          onClick={() => navigate('/app/surveys')}
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
        >
          <ClipboardList className="w-5 h-5" />
          Take Surveys & Earn Money
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Payment Method Alert */}
      {!hasPaymentMethod && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
            <p className="text-yellow-800">
              Add your M-PESA number to receive payments
            </p>
          </div>
          <button
            onClick={() => navigate('/app/settings')}
            className="flex items-center text-yellow-600 hover:text-yellow-700 font-medium"
          >
            Add Now
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">Ksh {totalEarnings}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          {recentEarnings.length > 0 && (
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-500 font-medium">Active</span>
              <span className="text-gray-500 ml-1">earning pattern</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Surveys Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedSurveys.length}</p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-accent-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-500">Lifetime completions</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Referral Earnings</p>
              <p className="text-2xl font-bold text-gray-900">Ksh 0</p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Link to="/app/referrals" className="text-primary-600 hover:text-primary-700">
              View referral program →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-gray-900">Ksh {totalEarnings}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <button 
              onClick={() => navigate('/app/settings')}
              className="text-sm px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Earnings */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Earnings</h2>
            </div>
          </div>
          <div className="p-6">
            {recentEarnings.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No earnings yet</h3>
                <p className="text-gray-600 mb-4">Complete surveys to start earning rewards</p>
                <Link
                  to="/app/surveys"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Browse Available Surveys →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentEarnings.map((earning, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Survey #{earning.surveyId}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(earning.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-gray-900">Ksh {earning.amount}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <Link
                to="/app/surveys"
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-primary-600" />
                    <span className="font-medium text-gray-900">Take Surveys</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>

              <Link
                to="/app/settings"
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Settings</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>

              <Link
                to="/app/referrals"
                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-secondary-600" />
                    <span className="font-medium text-gray-900">Invite Friends</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
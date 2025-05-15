import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Smartphone, 
  AlertCircle, 
  CheckCircle, 
  Eye,
  EyeOff,
  X,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../utils/auth';

interface PaymentMethod {
  type: 'mpesa';
  phoneNumber: string;
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastPasswordChange, setLastPasswordChange] = useState<string | null>(null);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    phoneNumber: ''
  });

  useEffect(() => {
    const paymentMethods = localStorage.getItem('paymentMethods');
    if (paymentMethods) {
      const methods = JSON.parse(paymentMethods);
      if (methods.mpesa) {
        setPaymentForm({ phoneNumber: methods.mpesa });
      }
    }

    const lastChange = localStorage.getItem('lastPasswordChange');
    setLastPasswordChange(lastChange);

    // Calculate total earnings
    const earnings = JSON.parse(localStorage.getItem('earnings') || '[]');
    const total = earnings.reduce((sum: number, earning: { amount: number }) => sum + earning.amount, 0);
    setTotalEarnings(total);
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const updatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage('New passwords do not match');
      return;
    }
    // In a real app, we would make an API call here
    const currentDate = new Date().toISOString();
    localStorage.setItem('lastPasswordChange', currentDate);
    setLastPasswordChange(currentDate);
    setSuccessMessage('Password updated successfully');
    setShowChangePassword(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const formatLastChanged = (dateString: string | null) => {
    if (!dateString) return 'Never changed';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  };

  const savePaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneRegex = /^(?:254|\+254|0)?([71](?:(?:[0-9][0-9])|(?:0[0-8]))[0-9]{6})$/;
    
    if (!phoneRegex.test(paymentForm.phoneNumber)) {
      setErrorMessage('Please enter a valid Kenyan phone number');
      return;
    }

    // Save to localStorage
    localStorage.setItem('paymentMethods', JSON.stringify({
      mpesa: paymentForm.phoneNumber
    }));

    setSuccessMessage('Payment method added successfully');
    setShowAddPayment(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center text-green-700">
          <CheckCircle className="w-5 h-5 mr-2" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2" />
          {errorMessage}
          <button 
            onClick={() => setErrorMessage('')}
            className="ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <div className="mt-1 flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-600" />
                </div>
                <span className="ml-3 text-gray-900">{user?.name}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1">
                <span className="text-gray-900">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
            <button
              onClick={() => setShowAddPayment(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add Payment Method
            </button>
          </div>
        </div>
        <div className="p-6">
          {paymentForm.phoneNumber ? (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">M-PESA</p>
                  <p className="text-sm text-gray-500">{paymentForm.phoneNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddPayment(true)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No payment methods added yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Withdrawal</h2>
            <button
              onClick={() => navigate('/app/withdrawal')}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Withdraw Funds
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Available Balance</p>
              <p className="text-2xl font-bold text-gray-900">Ksh {totalEarnings}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
            <button
              onClick={() => setShowChangePassword(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Password</p>
              <p className="text-sm text-gray-500">Last changed {formatLastChanged(lastPasswordChange)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
              <button onClick={() => setShowChangePassword(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <form onSubmit={updatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add M-PESA Number</h3>
              <button onClick={() => setShowAddPayment(false)}>
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <form onSubmit={savePaymentMethod} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={paymentForm.phoneNumber}
                  onChange={handlePaymentChange}
                  placeholder="e.g., 254712345678"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter your M-PESA registered phone number
                </p>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddPayment(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Save Number
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
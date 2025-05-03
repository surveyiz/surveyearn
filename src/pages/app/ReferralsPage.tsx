import React, { useState } from 'react';
import { Copy, Users, Gift, TrendingUp, AlertCircle } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';
import { Link } from 'react-router-dom';

const ReferralsPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const user = getCurrentUser();
  const referralCode = user?.id?.slice(0, 8).toUpperCase() || 'REF123';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
          <p className="text-gray-600 mt-1">Invite friends and earn together</p>
        </div>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Referrals</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Referral Earnings</p>
              <p className="text-2xl font-bold text-gray-900">Ksh 0</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">0%</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Referral Code Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-8 h-8 text-primary-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Share Your Referral Code
            </h2>
            <p className="text-gray-600 mb-8">
              Share your referral code with friends and earn Ksh 200 for each friend who completes their first survey
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="relative w-full sm:w-auto">
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl px-6 py-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Your Referral Code</p>
                  <p className="text-2xl font-bold text-gray-900 font-mono">{referralCode}</p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {copied ? (
                    <AlertCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="font-medium text-gray-900 mb-1">Step 1</p>
                <p className="text-sm text-gray-600">Share your unique referral code</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="font-medium text-gray-900 mb-1">Step 2</p>
                <p className="text-sm text-gray-600">Friend signs up using your code</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="font-medium text-gray-900 mb-1">Step 3</p>
                <p className="text-sm text-gray-600">Both earn rewards!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Referrals</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals yet</h3>
            <p className="text-gray-600 mb-6">Share your referral code to start earning rewards</p>
            <Link 
              to="/app/settings" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View your referral settings →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralsPage;
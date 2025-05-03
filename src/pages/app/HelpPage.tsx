import React, { useState } from 'react';
import { Search, HelpCircle, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: 1,
    category: 'Getting Started',
    question: 'How do I start taking surveys?',
    answer: 'To start taking surveys, simply log in to your account and visit the Surveys page. You\'ll see a list of available surveys that match your profile. Click on "Take Survey" to begin earning rewards.'
  },
  {
    id: 2,
    category: 'Getting Started',
    question: 'What are the requirements to join SurveyPlus?',
    answer: 'To join SurveyPlus, you need to be at least 18 years old, have a valid email address, and a Kenyan phone number for M-PESA payments. Registration is completely free.'
  },
  {
    id: 3,
    category: 'Earnings',
    question: 'How much can I earn per survey?',
    answer: 'Earnings vary by survey, typically ranging from Ksh 50 to Ksh 300 per completed survey. The exact amount is clearly shown before you start each survey.'
  },
  {
    id: 4,
    category: 'Earnings',
    question: 'When and how can I withdraw my earnings?',
    answer: 'You can withdraw your earnings once you reach Ksh 500. Payments are made via M-PESA and are processed within 24-48 hours of request.'
  },
  {
    id: 5,
    category: 'Survey Taking',
    question: 'Why do I have to wait 7 seconds between questions?',
    answer: 'The 7-second timer ensures that you have adequate time to read and consider each question carefully, leading to more thoughtful and accurate responses.'
  },
  {
    id: 6,
    category: 'Survey Taking',
    question: 'What happens if I lose internet connection during a survey?',
    answer: 'If you lose connection during a survey, your progress will be saved up to the last completed question. You can resume from where you left off when you reconnect.'
  },
  {
    id: 7,
    category: 'Account Management',
    question: 'How do I update my profile information?',
    answer: 'Go to Settings in your dashboard. Here you can update your personal information, change your password, and manage your payment methods.'
  },
  {
    id: 8,
    category: 'Account Management',
    question: 'Can I have multiple accounts?',
    answer: 'No, multiple accounts are not allowed. Each user may only have one account, and violations may result in account suspension.'
  },
  {
    id: 9,
    category: 'Referrals',
    question: 'How does the referral program work?',
    answer: 'Share your unique referral code with friends. When they sign up and complete their first survey, you\'ll earn a Ksh 200 bonus. There\'s no limit to how many people you can refer.'
  },
  {
    id: 10,
    category: 'Technical Issues',
    question: 'What should I do if a survey freezes?',
    answer: 'If a survey freezes, try refreshing the page. If the issue persists, log out and log back in. Your progress should be saved up to the last completed question.'
  },
  {
    id: 11,
    category: 'Payments',
    question: 'Why was my withdrawal rejected?',
    answer: 'Withdrawals may be rejected if the M-PESA number provided is incorrect or if there are pending account verification requirements. Check your payment settings and ensure all information is accurate.'
  },
  {
    id: 12,
    category: 'Survey Quality',
    question: 'What happens if I fail quality checks?',
    answer: 'Quality checks ensure honest participation. Failing multiple quality checks may result in reduced survey opportunities or account review. Always read questions carefully and answer truthfully.'
  },
  {
    id: 13,
    category: 'Account Security',
    question: 'How can I keep my account secure?',
    answer: 'Use a strong password, enable two-factor authentication if available, and never share your login credentials. Report any suspicious activity to our support team immediately.'
  },
  {
    id: 14,
    category: 'Survey Availability',
    question: 'Why am I not receiving many surveys?',
    answer: 'Survey availability depends on your profile matching survey requirements. Complete your profile fully and accurately to receive more relevant surveys. Check back regularly as new surveys are added daily.'
  },
  {
    id: 15,
    category: 'Technical Requirements',
    question: 'What devices can I use to take surveys?',
    answer: 'Surveys can be completed on any device with a modern web browser (desktop, laptop, tablet, or smartphone). However, some surveys may be optimized for specific devices, which will be indicated beforehand.'
  },
  {
    id: 16,
    category: 'Privacy',
    question: 'How is my personal information protected?',
    answer: 'We use industry-standard encryption and security measures to protect your data. Your personal information is never shared with survey providers without your consent and is only used to match you with relevant surveys.'
  },
  {
    id: 17,
    category: 'Survey Disqualification',
    question: 'Why do I sometimes get disqualified from surveys?',
    answer: 'Disqualification occurs when your profile doesn\'t match the specific requirements of a survey. This is normal and helps ensure accurate research results. You\'ll always be notified as early as possible in the process.'
  },
  {
    id: 18,
    category: 'Account Deletion',
    question: 'How can I delete my account?',
    answer: 'To delete your account, go to Settings and select the account deletion option. Please note that this action is permanent and will result in the loss of any unredeemed earnings.'
  },
  {
    id: 19,
    category: 'Survey Length',
    question: 'How long do surveys typically take?',
    answer: 'Survey length varies, but most take between 5-15 minutes to complete. The estimated completion time is always shown before you start a survey.'
  },
  {
    id: 20,
    category: 'Support',
    question: 'How can I contact support?',
    answer: 'For immediate assistance, email us at support@surveyplus.com. Include your account email and any relevant screenshots. Our support team typically responds within 24 hours.'
  }
];

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
        <p className="mt-2 text-gray-600">
          Find answers to common questions or contact our support team
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !selectedCategory
                ? 'bg-primary-100 text-primary-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or browse all categories
            </p>
            <Link
              to="/contact"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Contact Support →
            </Link>
          </div>
        ) : (
          filteredFAQs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.question}</span>
                {openFAQ === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {openFAQ === faq.id && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Contact Support */}
      <div className="mt-12 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Still need help?</h3>
            <p className="text-primary-100 mb-4">
              Our support team is here to assist you
            </p>
            <a
              href="mailto:support@surveyplus.com"
              className="inline-flex items-center px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
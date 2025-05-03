import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Settings, 
  HelpCircle,
  X
} from 'lucide-react';

interface AppSidebarProps {
  onClose?: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const earnings = JSON.parse(localStorage.getItem('earnings') || '[]');
  const totalEarnings = earnings.reduce((sum: number, earning: { amount: number }) => sum + earning.amount, 0);
  
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/app/dashboard' },
    { name: 'Surveys', icon: <ClipboardList size={20} />, path: '/app/surveys' },
    { name: 'Referrals', icon: <Users size={20} />, path: '/app/referrals' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/app/settings' },
    { name: 'Help', icon: <HelpCircle size={20} />, path: '/app/help' },
  ];

  return (
    <aside className="w-64 h-full bg-white/80 backdrop-blur-xl border-r border-gray-200 shrink-0 flex flex-col">
      {/* Mobile Close Button */}
      <button
        onClick={onClose}
        className="md:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
      >
        <X size={20} />
      </button>

      <div className="flex-1 px-3 py-6 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 
                ${isActive 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`mr-3 ${isActive ? 'text-primary-700' : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </div>
        
        <div className="mt-12 space-y-2">
          <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-lg p-4 text-white shadow-md">
            <h3 className="font-medium mb-1">Earned so far</h3>
            <p className="text-2xl font-bold">Ksh {totalEarnings}</p>
            <Link 
              to="/app/settings"
              onClick={onClose}
              className="mt-3 block w-full py-1.5 bg-white text-primary-600 rounded-md text-sm font-medium text-center hover:bg-gray-50 transition-colors"
            >
              Withdraw
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
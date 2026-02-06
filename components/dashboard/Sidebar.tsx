import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Inbox, BookOpen, Plug, Settings, 
  LogOut, Calendar, BarChart3 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo';

const navItems = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads', path: '/dashboard/leads', icon: Users },
  { name: 'Inbox', path: '/dashboard/inbox', icon: Inbox, badge: true },
  { name: 'Calendar', path: '/dashboard/calendar', icon: Calendar },
  { name: 'Projects', path: '/dashboard/projects', icon: BarChart3 },
  { name: 'Knowledge Base', path: '/dashboard/knowledge', icon: BookOpen },
  { name: 'Integrations', path: '/dashboard/integrations', icon: Plug },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#020205] border-r border-white/5 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Logo size="sm" showText={true} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#C5A059]' : ''}`} />
                {item.name}
              </div>
              {item.badge && (
                <span className="w-2 h-2 rounded-full bg-[#FF6B2B] animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/5">
        <div className="px-4 py-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C5A059] to-[#8F7030] flex items-center justify-center text-black font-bold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        <button
          data-testid="logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

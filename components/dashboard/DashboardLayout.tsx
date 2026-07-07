import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, CheckSquare, Microscope, BarChart2, Folder, Bell, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useGoogleAuth } from '../../context/GoogleAuthContext';

const navItems = [
  { label: 'Home', to: '/dashboard', icon: Home },
  { label: 'Tasks', to: '/dashboard/tasks', icon: CheckSquare },
  { label: 'Research', to: '/dashboard/research', icon: Microscope },
  { label: 'Analytics', to: '/dashboard/analytics', icon: BarChart2 },
  { label: 'Files', to: '/dashboard/files', icon: Folder },
  { label: 'Settings', to: '/dashboard/settings', icon: SettingsIcon },
];

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { logout: googleLogout } = useGoogleAuth();
  
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLogoutMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    googleLogout(); // Clears google tokens from local storage
    await signOut(); // Signs out of Supabase
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#050505] selection:bg-[#050505] selection:text-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FAFAFA]/80 backdrop-blur-xl border-b border-black/5 px-4 py-3 flex items-center justify-between">
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowLogoutMenu(!showLogoutMenu)}
            className="flex items-center gap-3 text-left hover:bg-black/5 p-1 -ml-1 rounded-xl transition-colors"
          >
            <div className="flex h-10 items-center justify-center">
               <img src="/logo.png" alt="HOS Logo" className="h-8 object-contain dark:invert" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-[#050505] leading-none mb-1">HOS Labs</h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Build. Research. Close.</p>
            </div>
          </button>

          {/* Logout Dropdown */}
          {showLogoutMenu && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          )}
        </div>
        
        <a 
          href="https://docs.google.com/spreadsheets/d/1pfa-cSewdEBBvZ7OTdVtuZIxWGS9XX6BWyDsvv5WvGM/edit?usp=drivesdk"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
          title="Open Google Sheets Database"
        >
          <img src="/sheets-logo.png" alt="Google Sheets" className="w-6 h-6 object-contain" />
        </a>
      </header>

      {/* Main Content Area */}
      <main className="px-4 py-6 max-w-3xl mx-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-[#FFFFFF] border-t border-black/5 pb-safe">
        <div className="flex items-center justify-around px-2 py-2 max-w-3xl mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Exact match for home, startsWith for others to keep tab active on subpages
            const isActive = item.to === '/dashboard' 
              ? location.pathname === '/dashboard' 
              : location.pathname.startsWith(item.to);

            return (
              <NavLink 
                key={item.to} 
                to={item.to}
                className="flex-1 flex flex-col items-center justify-center py-2"
              >
                <Icon 
                  className={`w-6 h-6 mb-1 ${isActive ? 'text-[#050505] fill-[#050505]/10' : 'text-gray-400'}`} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span 
                  className={`text-[10px] transition-colors ${isActive ? 'text-[#050505] font-semibold' : 'text-gray-500 font-medium'}`}
                >
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default DashboardLayout;

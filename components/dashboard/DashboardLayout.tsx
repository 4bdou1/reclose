import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Microscope, BarChart2, Folder, Bell, Settings as SettingsIcon } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#050505] selection:bg-[#050505] selection:text-white pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FAFAFA]/80 backdrop-blur-xl border-b border-black/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 items-center justify-center">
             <img src="/logo.png" alt="HOS Logo" className="h-8 object-contain dark:invert" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-[#050505] leading-none mb-1">HOS Labs</h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Build. Research. Close.</p>
          </div>
        </div>
        
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-black/5 hover:text-black transition-colors">
          <Bell className="w-5 h-5" />
        </button>
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

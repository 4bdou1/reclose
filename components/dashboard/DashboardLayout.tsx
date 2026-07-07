import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Bell,
  Folder,
  Home,
  LogOut,
  Microscope,
  ListTodo,
} from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { label: 'Home', to: '/dashboard', icon: Home },
  { label: 'Tasks', to: '/dashboard/tasks', icon: ListTodo },
  { label: 'Research', to: '/dashboard/research', icon: Microscope },
  { label: 'Analytics', to: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Files', to: '/dashboard/files', icon: Folder },
];

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
};

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="hos-app-shell min-h-screen text-white selection:bg-[#E8D7AA]/20">
      <div className="pointer-events-none fixed inset-0 hos-grid-overlay opacity-20" />
      <div className="pointer-events-none fixed left-1/2 top-[-18rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-[#E8D7AA]/10 blur-[180px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-40 pt-5 sm:px-6">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
              <img src="/hos-logo.png" alt="HOS Labs" className="h-8 w-auto object-contain" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.36em] text-[#E8D7AA]/82">HOS Labs</p>
              <p className="mt-1 text-sm text-white/40">Mission control</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/74 transition-colors hover:text-white">
              <Bell className="h-5 w-5" />
            </button>
            <button
              onClick={handleLogout}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E8D7AA]/16 bg-[#121214] text-base font-medium text-white hos-gold-glow"
              aria-label="Open account menu"
              title="Sign out"
            >
              A
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.main key={location.pathname} {...pageTransition}>
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>

      <nav className="fixed inset-x-0 bottom-4 z-50 px-4 sm:px-6">
        <div className="mx-auto grid max-w-3xl grid-cols-5 gap-2 rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(10,10,13,0.94)_0%,rgba(5,5,7,0.9)_100%)] p-2 shadow-[0_30px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink key={item.to} to={item.to} end={item.to === '/dashboard'}>
                {({ isActive }) => (
                  <div
                    className={`lux-button flex h-full flex-col items-center justify-center gap-2 rounded-[1.45rem] px-2 py-3 text-center ${
                      isActive
                        ? 'bg-[#E8D7AA]/10 text-[#F5E8C5] hos-gold-glow'
                        : 'text-white/36 hover:text-white/72'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-[11px] font-medium uppercase tracking-[0.22em]">
                      {item.label}
                    </span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#111',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            borderRadius: '16px',
          },
        }}
      />
    </div>
  );
};

export default DashboardLayout;

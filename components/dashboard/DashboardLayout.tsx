import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Toaster } from 'sonner';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020205]">
      <Sidebar />
      <main className="ml-64 min-h-screen p-8">
        <Outlet />
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0A0A0A',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
          },
        }}
      />
    </div>
  );
};

export default DashboardLayout;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { isWebview } from '../lib/detectWebview';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  // Force the entire page background to be dark while on the Auth screen
  useEffect(() => {
    document.body.style.backgroundColor = '#050505';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // Supabase OAuth redirects the page, so no further code here will execute.
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (isWebview()) {
    return (
      <div className="min-h-screen flex bg-[#050505] text-white p-6">
        <div className="w-full max-w-md mx-auto mt-20 bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-4">Unsupported Browser</h2>
          <p className="text-gray-400 mb-6">
            Google does not allow signing in from embedded social media browsers (like Instagram, Facebook, or WhatsApp).
          </p>
          <p className="text-white font-semibold">
            Please tap the three dots in the corner and select "Open in System Browser" (Safari/Chrome) to log in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#050505] text-white">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-[#111] border border-white/5 p-8 rounded-3xl shadow-2xl">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="mb-8 flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          {/* Logo */}
          <div className="mb-10 flex justify-center">
            <Logo size="md" showText={true} theme="dark" />
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold tracking-tight mb-2">Admin Login</h1>
            <p className="text-gray-500 text-sm">Authorized users only</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-14 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-8"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

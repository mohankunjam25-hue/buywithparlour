import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuthStore } from '../../../store/authStore';
import { X, Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthModalOpen,
    closeAuthModal,
    authRedirectPath,
    login,
    register,
    loginWithGoogle,
  } = useAuthStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // 1-Click Google OAuth Flow
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setErrorMsg('');
        const userInfoRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = userInfoRes.data;
        if (googleUser?.email) {
          await loginWithGoogle(googleUser.email, googleUser.name || 'Google Customer');
          setToastMsg(`✨ Welcome, ${googleUser.name || 'Customer'}!`);
          setTimeout(() => {
            closeAuthModal();
            if (authRedirectPath) navigate(authRedirectPath);
          }, 700);
        }
      } catch (err) {
        console.error('Google Auth Processing Error:', err);
        setErrorMsg('Google login failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: (errorResponse) => {
      console.error('Google Sign-In Error:', errorResponse);
      setErrorMsg('Google login was cancelled.');
    },
  });

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate rapid submission
    setErrorMsg('');
    setToastMsg('');
    setLoading(true);
    
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      setErrorMsg('');

      if (isSignUp) {
        if (!fullName.trim()) {
          setErrorMsg('Please enter your full name.');
          setLoading(false);
          return;
        }
        await register(fullName, email, password, phone);
        setToastMsg('🎉 Account created successfully! Welcome.');
      } else {
        await login(email, password);
        setToastMsg('✨ Welcome back! Login successful.');
      }

      setTimeout(() => {
        closeAuthModal();
        if (authRedirectPath) navigate(authRedirectPath);
      }, 700);
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message ||
          (isSignUp ? 'Registration failed. Email might already exist.' : 'Invalid email or password.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#212121]/60 z-50 flex items-center justify-center p-4 font-sans backdrop-blur-xs">
      <div className="bg-white border border-[#E0E0E0] rounded-[4px] max-w-md w-full p-6 space-y-4 shadow-[0_4px_16px_rgba(0,0,0,0.16)] relative animate-fade-in text-[#212121]">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-[#878787] hover:text-[#212121] p-1 rounded-[2px] hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Flipkart Theme */}
        <div className="border-b border-[#EEEEEE] pb-3">
          {authRedirectPath && (
            <div className="bg-[#E3F2FD] text-[#2874F0] text-xs font-semibold p-2 rounded-[2px] mb-2 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 flex-shrink-0" />
              <span>Please log in to continue checkout and place your order</span>
            </div>
          )}
          <h2 className="text-lg font-bold text-[#212121]">
            {isSignUp ? 'Create BuyWithParlour Account' : 'Login to BuyWithParlour'}
          </h2>
          <p className="text-xs text-[#666666] mt-0.5">
            {isSignUp
              ? 'Join thousands of beauty shoppers & parlour professionals'
              : 'Enter your credentials to access your account & orders'}
          </p>
        </div>

        {/* Alerts */}
        {toastMsg && (
          <div className="bg-[#E8F5E9] border border-[#2E7D32]/20 text-[#2E7D32] p-2.5 rounded-[2px] text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="bg-[#FFEBEE] border border-[#D32F2F]/20 text-[#D32F2F] p-2.5 rounded-[2px] text-xs font-semibold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1-Click Google OAuth */}
        <button
          type="button"
          onClick={() => triggerGoogleLogin()}
          disabled={loading}
          className="w-full bg-white hover:bg-slate-50 text-[#212121] font-semibold text-xs py-2.5 px-4 rounded-[2px] border border-[#E0E0E0] shadow-sm flex items-center justify-center gap-3 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#E0E0E0] w-full" />
          <span className="bg-white px-2 text-[10px] text-[#878787] font-semibold uppercase absolute">
            OR
          </span>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {isSignUp && (
            <div>
              <label className="font-semibold text-[#212121] block mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#878787] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Anjali Sharma"
                  className="w-full bg-white border border-[#E0E0E0] rounded-[2px] pl-9 pr-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="font-semibold text-[#212121] block mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#878787] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-white border border-[#E0E0E0] rounded-[2px] pl-9 pr-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-[#212121] block mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#878787] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-white border border-[#E0E0E0] rounded-[2px] pl-9 pr-9 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#878787] hover:text-[#212121]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="font-semibold text-[#212121] block mb-1">
                Mobile Number <span className="text-[#878787] font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#878787] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210 (Optional)"
                  className="w-full bg-white border border-[#E0E0E0] rounded-[2px] pl-9 pr-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#2874F0]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2874F0] hover:bg-[#1259c7] text-white font-semibold text-xs py-2.5 rounded-[2px] shadow-sm transition-colors cursor-pointer"
          >
            {loading ? 'Processing...' : isSignUp ? 'CREATE ACCOUNT' : 'LOGIN'}
          </button>
        </form>

        {/* Toggle between Login and Signup */}
        <div className="border-t border-[#EEEEEE] pt-3 text-center text-xs text-[#666666]">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMsg('');
                }}
                className="text-[#2874F0] font-semibold hover:underline cursor-pointer"
              >
                Log in
              </button>
            </span>
          ) : (
            <span>
              New to BuyWithParlour?{' '}
              <button
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMsg('');
                }}
                className="text-[#2874F0] font-semibold hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

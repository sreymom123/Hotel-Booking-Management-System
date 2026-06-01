import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Headphones, 
  Globe2,
  Loader2,
  CheckCircle2
} from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (email: string) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('admin@grandhorizon.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setErrorMessage('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Login failed');
      }

      const admin = result.data.admin ?? result.data.user;

      if (!admin || admin.role !== 'admin') {
        throw new Error('Admin access is required');
      }

      localStorage.setItem('gh_admin_token', result.data.token);
      localStorage.setItem('gh_admin_profile', JSON.stringify(admin));
      setIsAuthenticating(false);
      setAuthSuccess(true);

      setTimeout(() => {
        onLoginSuccess(admin.email);
      }, 800);
    } catch (error) {
      setIsAuthenticating(false);
      setAuthSuccess(false);
      setErrorMessage(error instanceof Error ? error.message : 'Login failed');
    }
  };

  return (
    <div className="login-canvas min-h-screen bg-surface-bright flex items-center justify-center p-8 relative overflow-hidden font-sans">
      <main className="w-[420px] z-10">
        {/* Logo/Brand Anchor Section */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-16 h-16 bg-primary-container flex items-center justify-center rounded-xl mb-4 shadow-sm border border-outline-variant/30">
            <Building2 className="text-[#b6c6ee] w-9 h-9" />
          </div>
          <h1 className="text-3xl font-semibold text-primary-container tracking-tight">Grand Horizon</h1>
          <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase mt-1">HOSPITALITY MANAGEMENT SYSTEM</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
          <header className="mb-6">
            <h2 className="text-xl font-semibold text-on-surface">Admin Login</h2>
            <p className="text-sm text-on-surface-variant mt-1">Enter your credentials to access the management dashboard.</p>
          </header>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/70">
                  <Mail className="w-[18px] h-[18px]" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary-container/10 focus:border-primary-container outline-none transition-all placeholder:text-outline-variant"
                  placeholder="name@grandhorizon.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase" htmlFor="password">
                  Password
                </label>
                <button 
                  type="button" 
                  onClick={() => alert("Password reset link has been dispatched to admin security mailbox.")}
                  className="text-xs font-medium text-primary-container hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-on-surface-variant/70">
                  <Lock className="w-[18px] h-[18px]" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-11 py-3 bg-white border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary-container/10 focus:border-primary-container outline-none transition-all placeholder:text-outline-variant"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-on-surface-variant/60 hover:text-primary-container transition-colors"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {errorMessage}
              </p>
            )}

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary-container border-outline-variant rounded focus:ring-primary-container cursor-pointer accent-primary-container"
              />
              <label htmlFor="remember" className="text-xs text-on-surface-variant cursor-pointer select-none">
                Remember this device for 30 days
              </label>
            </div>

            {/* Login Button */}
            <button
              id="loginBtn"
              type="submit"
              disabled={isAuthenticating || authSuccess}
              className={`w-full py-3 rounded-lg shadow-sm font-semibold text-xs tracking-wider uppercase transition-all duration-350 flex items-center justify-center gap-2 mt-6 active:scale-[0.98] ${
                authSuccess 
                  ? 'bg-[#4a9e8f] text-white' 
                  : 'bg-primary-container text-white hover:bg-[#364768] hover:shadow'
              }`}
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AUTHENTICATING...
                </>
              ) : authSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  SUCCESS
                </>
              ) : (
                <>
                  Login to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <footer className="mt-8 pt-6 border-t border-outline-variant/60">
            <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant/30">
              <ShieldCheck className="text-primary-container w-6 h-6 flex-shrink-0" />
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Secure SSL Encrypted Connection. All access attempts are logged for security auditing.
              </p>
            </div>
          </footer>
        </div>

        {/* Decorative Info Cards (Desktop) */}
        <div className="hidden sm:grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl flex items-center gap-4 shadow-sm">
            <div className="p-1.5 bg-surface-container rounded-lg text-primary-container">
              <Headphones className="w-[18px] h-[18px]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">IT Support</span>
              <span className="text-xs font-semibold text-on-surface">Ext. 4055</span>
            </div>
          </div>
          
          <div className="p-4 bg-surface-container-lowest border border-outline-variant rounded-xl flex items-center gap-4 shadow-sm">
            <div className="p-1.5 bg-surface-container rounded-lg text-primary-container">
              <Globe2 className="w-[18px] h-[18px]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Region</span>
              <span className="text-xs font-semibold text-on-surface">North America</span>
            </div>
          </div>
        </div>
      </main>

      {/* Background Decoration Image */}
      <div className="fixed bottom-0 right-0 p-12 opacity-10 pointer-events-none hidden lg:block">
        <img
          alt="Hotel Abstract Detail"
          className="w-80 grayscale contrast-125 rounded-lg select-none"
          referrerPolicy="no-referrer"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4h7EC6OGkwetZaN0ULVNy_8MMLGfo8roP1B45ZU4_FhTf-FFFIoXL874Gvsp8Rf98HRTPw8kxSBr59-rIfbesLC_JFhCEGyTqLsuTAH8N36mizcR9lAt4lnrP9CUYbK8W3DiXJHc1w1sTkYuvSLqbNdq87mJoEeZxKRwdwgsWkBMghVieTpYguu1MDz7ybZESdUlWNKwjNeKibbvh3KtWjB0ciHfPdmWxYGaLMfxYxDLWEcszqzf7eQDfRhhcVo3ycm2pKwE9d88"
        />
      </div>
    </div>
  );
}

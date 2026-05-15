import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  MapPin,
  Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

interface AuthPageProps {
  lang: 'en' | 'bn';
  t: any;
}

export default function AuthPage({ lang, t }: AuthPageProps) {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ 
    email: '', 
    password: '',
    displayName: '',
    phoneNumber: '',
    address: '',
    city: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (authMode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              full_name: form.displayName,
              phone_number: form.phoneNumber,
              address: form.address,
              city: form.city
            }
          }
        });
        if (error) throw error;
      }
      navigate('/');
    } catch (err: any) {
      if (err.message.includes("provider is not enabled")) {
        setError("Authentication error: Please enable 'Email' provider in your Supabase Dashboard (Auth > Providers).");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div 
  className="min-h-screen text-black dark:text-gray-200 font-sans selection:bg-black selection:text-white transition-colors duration-300"
  style={{
    backgroundColor: 'transparent', 
    backgroundImage: 'radial-gradient(rgba(128, 128, 128, 0.3) 0.5px, transparent 0.7px)',
    backgroundSize: '10px 10px'
  }}
    >
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Shop</span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white dark:bg-[#111] rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-white/10"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
              {authMode === 'login' ? <LogIn className="w-10 h-10" /> : <UserPlus className="w-10 h-10" />}
            </div>
            <h2 className="text-4xl font-serif dark:text-white mb-2">
              {authMode === 'login' ? t.welcome : t.create_account}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-modern">
              {authMode === 'login' ? 'Enter your details to access your account' : 'Join our community and start shopping'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {authMode === 'register' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-modern font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      required 
                      type="text" 
                      placeholder="MD Minhaz Uddin"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-premium-gold dark:text-white transition-all outline-none font-modern"
                      value={form.displayName}
                      onChange={(e) => setForm({...form, displayName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      required 
                      type="tel" 
                      placeholder="+880 1625 043206"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white transition-all outline-none"
                      value={form.phoneNumber}
                      onChange={(e) => setForm({...form, phoneNumber: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">City</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        required 
                        type="text" 
                        placeholder="Dhaka"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white transition-all outline-none"
                        value={form.city}
                        onChange={(e) => setForm({...form, city: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        required 
                        type="text" 
                        placeholder="Street Address"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white transition-all outline-none"
                        value={form.address}
                        onChange={(e) => setForm({...form, address: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">{t.email}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  required 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white transition-all outline-none"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">{t.password}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  required 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white transition-all outline-none"
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  {authMode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  {authMode === 'login' ? t.login : t.register}
                </>
              )}
            </button>
          </form>

          {/* Google login removed as per user request */}

          <p className="mt-10 text-center text-sm text-gray-500">
            {authMode === 'login' ? t.no_account : t.has_account}{' '}
            <button 
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'register' : 'login');
                setError(null);
              }}
              className="text-black dark:text-white font-bold underline hover:opacity-70 transition-opacity"
            >
              {authMode === 'login' ? t.register : t.login}
            </button>
          </p>
        </motion.div>
      </div>

      {/* Footer info */}
      <div className="p-8 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-600">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
    </div>
  );
}

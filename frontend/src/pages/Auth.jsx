import { useState } from 'react';
import { supabase } from '../api/supabase';
import { Eye, EyeOff, Mail, Lock, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmailSent(false);

    if (isLogin) {
      // LOGIN LOGIC
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Welcome back, Doctor!');
      }
    } else {
      // SIGNUP LOGIC
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        // If Supabase is set to confirm email, data.session will be null
        if (data?.user && !data?.session) {
          setEmailSent(true);
          toast.success('Account created successfully!');
        } else {
          toast.success('Registration successful!');
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-100 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl text-white mb-4 shadow-lg shadow-blue-200">
            <Stethoscope size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-900">
            {isLogin ? 'Clinic Login' : 'Register Clinic'}
          </h2>
          <p className="text-gray-500 font-medium mt-1">Med-AI Assistant for Rural Clinics</p>
        </div>

        {emailSent ? (
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={32} />
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-2">Check your email</h3>
            <p className="text-blue-700 text-sm leading-relaxed">
              We've sent a confirmation link to <span className="font-bold">{email}</span>. 
              Please verify your email to activate your clinic account.
            </p>
            <button 
              onClick={() => setEmailSent(false)}
              className="mt-6 text-blue-600 font-bold text-sm hover:underline"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" placeholder="Clinic Email" required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Password" required
                className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button 
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : isLogin ? 'Sign In' : 'Create Clinic Account'}
            </button>

            <div className="pt-4 text-center">
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmailSent(false);
                }}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                {isLogin ? "New clinic? Register for access" : "Already registered? Sign In"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
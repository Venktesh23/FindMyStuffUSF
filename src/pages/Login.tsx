import React, { useState } from 'react';
import { LogIn, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.email?.trim() || !formData.password) {
        throw new Error('Please fill in all fields');
      }

      if (!isLogin && formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Ensure password meets minimum requirements
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      if (isLogin) {
        await signIn(formData.email.trim(), formData.password);
        navigate('/home');
      } else {
        const result = await signUp(formData.email.trim(), formData.password);
        if (result.needsEmailConfirmation) {
          setSuccess('Account created! Please check your USF email to confirm your account before signing in.');
        } else {
          navigate('/home');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <Link
          to="/"
          className="flex items-center text-usf-green hover:text-usf-green/80 transition-colors mb-6 w-fit"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to home
        </Link>
        <div className="text-center">
          <div className="bg-usf-green/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="h-10 w-10 text-usf-green" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="text-lg text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Join the USF Lost & Found community'}
          </p>
          {!isLogin && (
            <div className="mt-3 bg-usf-green/10 border border-usf-green/20 rounded-lg px-4 py-2">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Note:</span> Only USF email addresses (@usf.edu) are accepted
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 w-full p-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-usf-green focus:border-transparent transition-all duration-200"
                placeholder="USF Email (@usf.edu)"
                disabled={loading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 w-full p-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-usf-green focus:border-transparent transition-all duration-200"
                placeholder="Password"
                disabled={loading}
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-usf-green focus:border-transparent transition-all duration-200"
                  placeholder="Confirm Password"
                  disabled={loading}
                />
              </div>
            )}
          </div>

          {isLogin && (
            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-usf-green hover:text-usf-green/80 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-xl text-white bg-usf-green hover:bg-usf-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-usf-green transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <User className="h-5 w-5 text-usf-green/60 group-hover:text-usf-green/40" aria-hidden="true" />
            </span>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setSuccess('');
              navigate(isLogin ? '/signup' : '/login');
            }}
            className="text-lg text-usf-green hover:text-usf-green/80 transition-colors"
            disabled={loading}
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
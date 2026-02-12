import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BackButton from '../components/BackButton';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email.toLowerCase().endsWith('@usf.edu')) {
        throw new Error('Only University of South Florida (@usf.edu) email addresses are allowed');
      }

      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <BackButton className="mb-6" />

        <div className="text-center">
          <div className="bg-usf-green/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-10 w-10 text-usf-green" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4">
              Check your email for password reset instructions.
            </div>
            <Link
              to="/login"
              className="text-usf-green hover:text-usf-green/80 transition-colors"
            >
              Return to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-usf-green focus:border-transparent"
                  placeholder="Email address"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-usf-green hover:bg-usf-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-usf-green disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
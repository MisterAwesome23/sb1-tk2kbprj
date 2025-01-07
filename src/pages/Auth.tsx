import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { supabase } from '../lib/supabase';

export function Auth() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<'employee' | 'employer'>('employee');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;

    try {
      if (isSignUp) {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: authData.user.id, username, role }]);

          if (profileError) throw profileError;
          
          // Redirect after successful signup
          navigate(role === 'employer' ? '/employer-dashboard' : '/employee-dashboard');
        }
      } else {
        const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          navigate(profile?.role === 'employer' ? '/employer-dashboard' : '/employee-dashboard');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="max-w-md mx-auto mt-16">
        <h1 className="text-3xl font-bold text-center mb-8">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  I am a
                </label>
                <div className="mt-1 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="employee"
                      checked={role === 'employee'}
                      onChange={(e) => setRole(e.target.value as 'employee')}
                      className="text-indigo-600"
                    />
                    <span className="ml-2">Job Seeker</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="employer"
                      checked={role === 'employer'}
                      onChange={(e) => setRole(e.target.value as 'employer')}
                      className="text-indigo-600"
                    />
                    <span className="ml-2">Employer</span>
                  </label>
                </div>
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <p className="mt-4 text-center">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Need an account?{' '}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </Container>
  );
}
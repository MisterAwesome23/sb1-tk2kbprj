import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export function AuthCallback() {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleAuthCallback() {
      try {
        // Process the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth session error:', error);
          throw error;
        }
        
        if (!data.session) {
          console.error('No session found');
          throw new Error('Authentication failed. Please try again.');
        }

        // Check if user has a profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile fetch error:', profileError);
          throw profileError;
        }

        // If no profile exists, create one
        if (!profile) {
          // Default to employee role for new Google sign-ins
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{ 
              id: data.session.user.id, 
              username: data.session.user.email?.split('@')[0] || 'user',
              role: 'employee',
              email: data.session.user.email
            }]);
          
          if (insertError) {
            console.error('Profile creation error:', insertError);
            throw insertError;
          }
          
          toast.success('Account created successfully!');
        }

        // Refresh the profile in context
        await refreshProfile();
        
        // Redirect based on role
        if (profile?.role === 'employer') {
          navigate('/employer-dashboard');
        } else {
          navigate('/employee-dashboard');
        }
        
        toast.success('Successfully signed in!');
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication error');
        toast.error('Authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setLoading(false);
      }
    }

    handleAuthCallback();
  }, [navigate, refreshProfile]);

  if (loading) {
    return (
      <Container>
        <div className="flex flex-col justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-600">Completing authentication...</p>
          <p className="text-sm text-gray-500 mt-2">You will be redirected shortly</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="max-w-md mx-auto mt-16 text-center">
          <div className="bg-red-50 text-red-600 p-4 rounded-md">
            {error}
          </div>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Return to Login
          </button>
        </div>
      </Container>
    );
  }

  return null;
}
import React, { useEffect, useState } from 'react';
import { Container } from '../components/ui/Container';
import { supabase } from '../lib/supabase';

export function EmployeeDashboard() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();
        if (data) {
          setUsername(data.username);
        }
      }
    }
    getProfile();
  }, []);

  return (
    <Container>
      <div className="max-w-3xl mx-auto py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Welcome, {username}!
        </h1>
        <p className="text-gray-600">
          Your job search journey begins here. Start exploring opportunities, take skill assessments,
          and connect with top employers looking for talent like you.
        </p>
      </div>
    </Container>
  );
}
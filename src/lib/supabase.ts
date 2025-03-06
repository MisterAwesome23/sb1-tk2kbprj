import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (...args) => fetch(...args)
  }
});

// Helper function to send emails via Supabase Edge Functions
export async function sendEmail(to: string, subject: string, content: string) {
  try {
    // Since Edge Functions might not be set up, we'll just log the email for now
    console.log(`Email would be sent to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${content}`);
    
    // In a real implementation, you would use Supabase Edge Functions:
    // const { error } = await supabase.functions.invoke('send-email', {
    //   body: { to, subject, content }
    // });
    
    // if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
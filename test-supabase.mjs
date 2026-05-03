import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://mjnzfxrqnswznlcxgecz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbnpmeHJxbnN3em5sY3hnZWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTg3NTMsImV4cCI6MjA5MjI3NDc1M30.2hyJdWAPIu3Z37PeM-82aZVCJMCvdJIj9G8tOUXZ0P4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('reservations').select('*').order('created_at', { ascending: false }).limit(5);
  console.log("Error:", error);
  console.log("Data length:", data?.length);
  if (data?.length > 0) {
    console.log("Latest reservation:", data[0]);
  }
}

check();

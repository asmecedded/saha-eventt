const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mjnzfxrqnswznlcxgecz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbnpmeHJxbnN3em5sY3hnZWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTg3NTMsImV4cCI6MjA5MjI3NDc1M30.2hyJdWAPIu3Z37PeM-82aZVCJMCvdJIj9G8tOUXZ0P4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('reservations').select('date_evenement, statut, status').eq('salle_id', 'ORN003').neq('statut', 'Refusé');
  console.log("Error:", error);
  console.log("Data:", data);
}

check();

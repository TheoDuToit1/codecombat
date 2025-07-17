import { createClient } from '@supabase/supabase-js';

// Hardcode the URL and key since we can't modify the .env file
const supabaseUrl = 'https://uxnmlfvjjmgbhjyxfuyq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4bm1sZnZqam1nYmhqeXhmdXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTg2ODEsImV4cCI6MjA2NjA5NDY4MX0.QiKyZ1Hhyy2_j-MmbsJk8iA98CDm49c3eN6xipg7vx8';

// Create client with basic configuration - no auth requirements
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  }
});

// Initialize storage without authentication
export const initializeStorage = async () => {
  try {
    // Test connection first
    const { data, error } = await supabase
      .from('sprites')
      .select('count')
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    throw error;
  }
};

// Storage bucket for assets
export const STORAGE_BUCKET = 'sprites'; 
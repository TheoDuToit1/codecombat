// Simple script to check if environment variables are loaded correctly
console.log('Checking Supabase environment variables:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL || 'Not set');
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set (value hidden)' : 'Not set');
 
// Export a dummy function to make TypeScript happy
export const checkEnv = () => {
  console.log('Environment variables check complete');
}; 
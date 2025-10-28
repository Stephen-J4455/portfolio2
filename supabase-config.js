// Supabase Configuration
// Replace these with your actual Supabase project credentials
// You can find these in your Supabase project settings

window.supabaseConfig = {
  url: "https://lfmrmxzgrfbcsoigafiu.supabase.co", // e.g., https://xxxxx.supabase.co
  anonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbXJteHpncmZiY3NvaWdhZml1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NjM4OTIsImV4cCI6MjA3MzMzOTg5Mn0.pxnjY8xufkvLDUeAgwhR-sDC913lwb5TvBy-a_ap478", // Your project's anon/public key
};

// Initialize Supabase client (requires Supabase JS library to be loaded first)
if (typeof supabase !== "undefined") {
  window.supabaseClient = supabase.createClient(
    window.supabaseConfig.url,
    window.supabaseConfig.anonKey
  );
}

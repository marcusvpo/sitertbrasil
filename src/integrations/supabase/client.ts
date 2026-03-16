import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://rxafivyrobvcsfglovsz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4YWZpdnlyb2J2Y3NmZ2xvdnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNDEyMDYsImV4cCI6MjA4ODkxNzIwNn0.q4tdw7K0Z0kWLXG0z6dcC9T6DzgJOVPdKFR-_5W4Gqk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

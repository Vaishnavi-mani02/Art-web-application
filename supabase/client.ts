
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zuxihzjrybkxhmwweedc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1eGloempyeWJreGhtd3dlZWRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMDQ2MzAsImV4cCI6MjA4Njg4MDYzMH0.4KbEsW8IYvC9A0EVQ-8Z6P0fQhYoZe_pNoZ4DcTpW2M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

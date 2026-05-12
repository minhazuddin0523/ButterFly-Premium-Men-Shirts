import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uwmffwxzbvvadoiehobu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3bWZmd3h6YnZ2YWRvaWVob2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwODkyNzYsImV4cCI6MjA5MTY2NTI3Nn0.BU5IfCVmh4vtBPSra5j6w3j4_ByrGFeMnZ1P32mtYPs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

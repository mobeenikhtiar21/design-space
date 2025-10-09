import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl) {
    console.error('Supabase URL is missing. Please set NEXT_PUBLIC_SUPABASE_URL in your .env.local file.');
}
if (!supabaseAnonKey) {
    console.error('Supabase Anon Key is missing. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
}

let supabase: SupabaseClient;

try {
    if (supabaseUrl && supabaseAnonKey) {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
        console.log('Supabase client initialized successfully.');
    } else {
        console.warn('Supabase client not initialized due to missing configuration.');
    }
} catch (error) {
    console.error('Error initializing Supabase client:', error);
}

export { supabase };

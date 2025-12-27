import { createClient } from '@supabase/supabase-js';

// These environment variables should be set in .env.local
// For now, using placeholders that the user can replace.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TripData {
    id?: string;
    destination: string;
    target_date: string;
    itinerary: any[];
}

/**
 * Note for the User:
 * You need a table named 'trips' with the following schema:
 * - id: uuid (primary key)
 * - destination: text
 * - target_date: timestamp with time zone
 * - itinerary: jsonb
 * - created_at: timestamp with time zone
 */

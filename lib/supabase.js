import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  },
  global: {
    headers: { 'x-my-custom-header': 'my-app-name' },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    channels: ['my-channel'],
  },
});
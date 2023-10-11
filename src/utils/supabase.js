// utils/supabaseClient.js

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://abuqrtstxqryqcvsohkz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFidXFydHN0eHFyeXFjdnNvaGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTY4MjIxNjQsImV4cCI6MjAxMjM5ODE2NH0.CyRWg7wCwWen7haP9_J5lvx8uXa5D6UbHx5SMaRP1Nw";

export const supabase = createClient(supabaseUrl, supabaseKey);

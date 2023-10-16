import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
	config();
} else {
	config({ path: ".env.production" });
}

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

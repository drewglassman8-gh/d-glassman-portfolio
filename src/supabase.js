import { createClient } from "@supabase/supabase-js";

const url = "https://hzhvwjtnwvhtrczestzey.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6aHZ3anRud3ZodHJjenN0emV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNTM2NTYsImV4cCI6MjA5NDYyOTY1Nn0.2mL4y2o_CobnoRuB5qOgs1PWKDw0ZeTNs1SgE6iSf48";

export const supabase = createClient(url, key);

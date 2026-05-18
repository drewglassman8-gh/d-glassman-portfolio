import { createClient } from "@supabase/supabase-js";

const url = "https://xoguezfivgqnmygynpgv.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZ3VlemZpdmdxbm15Z3lucGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMjYyNDAsImV4cCI6MjA5NDcwMjI0MH0.D9zm5M6ito4G0lg7BxI2cEa4ATBbyLfXuaJKIirj5C8";

export const supabase = createClient(url, key);

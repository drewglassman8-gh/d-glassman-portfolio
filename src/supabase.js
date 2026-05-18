import { createClient } from "@supabase/supabase-js";

const url = "https://hzhvwjtnwvhtrczestzey.supabase.co";
const key = "sb_publishable_4g3mxglhmqKQhyvrhp22gQ_IWmGrAfd";

export const supabase = createClient(url, key);

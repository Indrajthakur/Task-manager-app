
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Supabase project credentials
const SUPABASE_URL = "https://zzafooytbsvyvtpmsrwo.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_EBEpUSrwdgWFd8YXgfz8tA_ur6bp8PB";

// Create Supabase connection
export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


import { supabase } from "./supabase.js";

const { data, error } = await supabase.auth.getSession();

if (error || !data.session) {
    window.location.replace("./auth.html");
}

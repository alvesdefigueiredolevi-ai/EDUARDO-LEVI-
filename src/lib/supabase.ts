import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uvzskzqsptupbdchfgik.supabase.co';
const supabaseAnonKey = 'sb_publishable_79_-9YOnzENChIS0Zk_jNA_hniXuYhv';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

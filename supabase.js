// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://tkyhpwxarksxgjngerkj.supabase.co'
const supabaseKey = 'sb_publishable_l0NLXKZyF7OpFrvm34smCw_RG1raxsg'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Global helper for the current user session
export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

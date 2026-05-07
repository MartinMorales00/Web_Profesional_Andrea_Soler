import { createClient } from '@supabase/supabase-js'

// Estos datos los sacás de Settings > API en tu panel de Supabase
const supabaseUrl = 'https://nyhuereillgkgzjbzrph.supabase.co'
const supabaseAnonKey = 'sb_publishable_oBOGhRBTPk31-DL8rmS57Q_sXw9-BDl'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
import { supabase } from '@/lib/supabase';

export async function verifyAuthToken(token: string) {
  try {
    const { data: user, error } = await supabase
      .from('budget_tracker_app_cztuh_users')
      .select('id, email')
      .eq('id', token)
      .single();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

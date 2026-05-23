import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || '';

function isValidHttpUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

if (!supabaseUrl || !isValidHttpUrl(supabaseUrl) || !supabaseAnonKey) {
  if (__DEV__) {
    console.warn(
      '[supabase] Credentials manquantes ou invalides. ' +
      'L\'app fonctionnera en mode local (AsyncStorage). ' +
      'Configure EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY ' +
      'dans app.json → extra pour activer la synchro cloud.'
    );
  }
}

const _supabase = (isValidHttpUrl(supabaseUrl) && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const supabase = _supabase;

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  // Aplikasi tetap bisa dibuka (memakai data bawaan sementara di memori),
  // tapi TIDAK akan menyimpan perubahan apa pun sampai env var ini diisi.
  // Lihat README-SUPABASE.md untuk cara mengisinya.
  // eslint-disable-next-line no-console
  console.warn(
    '[Supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diset di .env. ' +
    'Data belum tersambung ke database dan tidak akan tersimpan permanen.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'public-anon-key-placeholder'
);

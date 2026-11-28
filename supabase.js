// Apenas chave pública. NUNCA coloque service_role aqui.
const SUPABASE_URL = "https://wupebblusbyasyeamzux.supabase.co";
const SUPABASE_KEY = "sb_publishable_uL3_qBp5ZpajU0hhH1MFBA_u1mbqibC";
window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

/* GFF — Cliente Supabase (chave pública apenas) */
(() => {
  "use strict";

  const SUPABASE_URL = "https://wupebblusbyasyeamzux.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_uL3_qBp5ZpajU0hhH1MFBA_u1mbqibC";

  // Aguarda o SDK global do CDN
  function waitForSupabase(timeoutMs = 8000) {
    return new Promise((resolve, reject) => {
      if (window.supabase && window.supabase.createClient) {
        resolve(window.supabase);
        return;
      }
      const start = Date.now();
      const timer = setInterval(() => {
        if (window.supabase && window.supabase.createClient) {
          clearInterval(timer);
          resolve(window.supabase);
        } else if (Date.now() - start > timeoutMs) {
          clearInterval(timer);
          reject(new Error("SDK Supabase não carregou a tempo."));
        }
      }, 50);
    });
  }

  let clientPromise = null;

  async function getClient() {
    if (clientPromise) return clientPromise;
    clientPromise = (async () => {
      const sdk = await waitForSupabase();
      const { createClient } = sdk;
      return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: window.localStorage
        }
      });
    })();
    return clientPromise;
  }

  // Expõe globalmente para os outros módulos
  window.GFF = window.GFF || {};
  window.GFF.getSupabase = getClient;
})();

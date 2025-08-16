/* supabase-singleton.js — un solo client Supabase condiviso in tutta l’app */
(function () {
  // Se già inizializzato, esci e notifica subito.
  if (window.supabaseClient) {
    document.dispatchEvent(new Event("supabase:ready"));
    return;
  }

  function loadUMD() {
    return new Promise((resolve, reject) => {
      if (window.supabase) return resolve();
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load Supabase JS"));
      document.head.appendChild(s);
    });
  }

  function getConfig() {
    const url =
      window.SUPABASE_URL ||
      localStorage.getItem("ilcustode.supabase.url") ||
      localStorage.getItem("SUPABASE_URL");
    const key =
      window.SUPABASE_ANON_KEY ||
      localStorage.getItem("ilcustode.supabase.key") ||
      localStorage.getItem("SUPABASE_ANON_KEY");
    if (!url || !key) {
      console.warn(
        "[supabase-singleton] Mancano SUPABASE_URL/ANON_KEY. " +
          "Imposta window.SUPABASE_URL / window.SUPABASE_ANON_KEY " +
          "oppure salva in localStorage ilcustode.supabase.url / ilcustode.supabase.key."
      );
    }
    return { url, key };
  }

  async function init() {
    try {
      await loadUMD();
      const { url, key } = getConfig();
      if (!url || !key) return;
      const client = window.supabase.createClient(url, key, {
        auth: { persistSession: true, autoRefreshToken: true },
        global: { fetch: (...a) => fetch(...a) },
      });
      window.supabaseClient = client;
      document.dispatchEvent(new Event("supabase:ready"));
      console.info("[supabase-singleton] pronto");
    } catch (e) {
      console.error("[supabase-singleton] init error", e);
    }
  }

  // Se più tardi imposti le variabili e lanci questo evento, il client si inizializza.
  document.addEventListener("supabase:set-config", () => {
    if (!window.supabaseClient) init();
  });

  init();
})();

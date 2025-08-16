/* assets/js/supabaseClient.js */
;(function () {
  const g = window;
  if (g.supabaseClient) return; // già pronto

  // Carica la libreria UMD se non è stata inclusa nella pagina
  function ensureSupabaseScript(){
    return new Promise((resolve, reject)=>{
      if (g.supabase) { resolve(); return; }
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      s.async = true;
      s.onload = ()=> resolve();
      s.onerror = ()=> reject(new Error('Failed to load Supabase JS'));
      document.head.appendChild(s);
    });
  }

  // Config: globali -> localStorage -> fallback (quelli che usi ora)
  function getEnv(){
    try{
      const url = g.SUPABASE_URL
        || localStorage.getItem('ilcustode.supabase.url')
        || 'https://djxxfzhvnejogcijpbtu.supabase.co';
      const key = g.SUPABASE_ANON_KEY
        || localStorage.getItem('ilcustode.supabase.key')
        || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqeHhmemh2bmVqb2djaWpwYnR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5ODkzNDEsImV4cCI6MjA3MDU2NTM0MX0.h3OJPo--ovVCYsPmX4g2LUVsK9npecTeAgr5u4by_-k';
      return { url, key };
    } catch {
      return { url:'', key:'' };
    }
  }

  async function boot(){
    try{
      await ensureSupabaseScript();
      const { url, key } = getEnv();
      if (!url || !key) { console.error('[supabaseClient] Missing URL/KEY'); return; }
      g.supabaseClient = g.supabase.createClient(url, key);
      document.dispatchEvent(new Event('supabase:ready'));
    } catch (e){
      console.error('[supabaseClient] init error', e);
    }
  }

  boot();
})();

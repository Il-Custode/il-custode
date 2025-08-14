// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  startServer: (password) => ipcRenderer.send('start-server', password),
  connectToServer: (ip, password) => ipcRenderer.send('connect-server', { ip, password }),
  openPage: (page) => ipcRenderer.send('open-page', page),
  sendChatMessage: (message) => ipcRenderer.send('chat-message', message),
  onChatMessage: (callback) => ipcRenderer.on('chat-message', (_event, msg) => callback(msg)),
  onPlayerListUpdate: (callback) => ipcRenderer.on('update-player-list', (_event, players) => callback(players)),
});

contextBridge.exposeInMainWorld('authCreds', {
  getSaved: async () => {
    try {
      const email = localStorage.getItem('ilcustode.savedEmail') || '';
      const password = await ipcRenderer.invoke('cred:get', email);
      return { email, password: password || '' };
    } catch {
      return { email: '', password: '' };
    }
  },
  save: async (email, password) => {
    try {
      if (email) localStorage.setItem('ilcustode.savedEmail', email);
      else localStorage.removeItem('ilcustode.savedEmail');
      if (email && password) await ipcRenderer.invoke('cred:set', { email, password });
      return true;
    } catch {
      return false;
    }
  },
  clear: async () => {
    try {
      localStorage.removeItem('ilcustode.savedEmail');
      await ipcRenderer.invoke('cred:clear');
      return true;
    } catch {
      return false;
    }
  },
});

// ----- scorciatoie tastiera globali (già presenti) -----
(function installGlobalKeys() {
  const KEY = '__ilcustode_keys_installed__';
  if (window[KEY]) return;
  window[KEY] = true;

  window.addEventListener('keydown', (e) => {
    const tgt = e.target;
    const tag = (tgt.tagName || '').toUpperCase();
    if (tgt.isContentEditable) return;

    // ENTER invia il form corrente
    if (e.key === 'Enter' && tag !== 'TEXTAREA') {
      let form = tgt.form || (typeof tgt.closest === 'function' ? tgt.closest('form') : null);
      if (form) {
        e.preventDefault();
        if (typeof form.requestSubmit === 'function') {
          const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]') || undefined;
          form.requestSubmit(submitBtn);
        } else {
          form.submit();
        }
      } else {
        const btn = document.querySelector(
          '[data-default], button[type="submit"], .btn[type="submit"], #btnLogin, .btn.default, .btn-primary'
        );
        if (btn) {
          e.preventDefault();
          try { btn.click(); } catch {}
        }
      }
    }

    // TAB cicla tra gli elementi focusabili
    if (e.key === 'Tab') {
      const focusable = Array.from(
        document.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input:not([disabled]), select'
        )
      ).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);
      const index = focusable.indexOf(document.activeElement);
      if (index !== -1) {
        e.preventDefault();
        let nextIndex = index + (e.shiftKey ? -1 : 1);
        if (nextIndex >= focusable.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = focusable.length - 1;
        focusable[nextIndex].focus();
      }
    }
  }, true);
})();

/* ======= SFONDO PERGAMENA GLOBALE (un solo punto) ======= */
(function installGlobalParchmentTheme(){
  const STYLE_ID = 'global-parchment-style';

  function computeAssetsBase(){
    try{
      const p = (location.pathname || '').replace(/\\/g,'/');
      return p.includes('/pages/') ? '..' : '.';
    }catch{ return '.'; }
  }

  function injectStyle(){
    if (document.getElementById(STYLE_ID)) return;

    const base = computeAssetsBase();

    const css = `
      :root{
        --legno:#4b3621; --pelle:#d2b48c; --pelle-scura:#c2a178; --inchiostro:#3e2f1c; --pergamena:#fff3d4;
      }
      /* Applica solo se la pagina NON chiede esplicitamente di disattivarlo */
      body:not(.no-parchment):not([data-no-parchment]) {
        background:
          radial-gradient(80% 60% at 50% 40%, rgba(0,0,0,.06), transparent 70%),
          var(--pergamena)
          url('${base}/assets/img/sfondo-pergamena-decor.jpg') no-repeat center center fixed;
        background-size: cover;
        color: var(--inchiostro);
      }
      /* Cornice legno se la pagina usa .cornice */
      .cornice {
        border: 40px solid transparent;
        -webkit-border-image: url('${base}/assets/img/cornice-legno.png') 40 stretch;
        border-image: url('${base}/assets/img/cornice-legno.png') 40 stretch;
      }
    `;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;

    // Inseriamo come PRIMO nodo di <head> così gli stili interni delle singole pagine (che arrivano dopo) possono sovrascrivere
    const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
    if (head.firstChild) head.insertBefore(style, head.firstChild);
    else head.appendChild(style);
  }

  if (document.head) {
    try { injectStyle(); } catch(e){ console.warn('Parchment inject error:', e); }
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      try { injectStyle(); } catch(e){ console.warn('Parchment inject error:', e); }
    }, { once:true });
  }
})();

/* ===== Pulsante "Chiudi app" visibile in TUTTE le pagine ===== */
window.addEventListener('DOMContentLoaded', () => {
  try {
    // evita duplicati
    if (document.getElementById('app-close-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'app-close-btn';
    btn.textContent = '✖ Chiudi app';

    // stile fisso nell'angolo in basso a destra
    Object.assign(btn.style, {
      position: 'fixed',
      bottom: '14px',
      right: '14px',
      zIndex: '999999',
      background: '#8b0000',
      color: '#fff',
      border: 'none',
      padding: '10px 14px',
      cursor: 'pointer',
      fontSize: '14px',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,.25)'
    });

    btn.addEventListener('mouseenter', () => { btn.style.background = '#a40000'; });
    btn.addEventListener('mouseleave', () => { btn.style.background = '#8b0000'; });

    // Chiude la finestra corrente (se è l'unica, chiude tutta l'app)
    btn.addEventListener('click', () => {
      window.close();
    });

    document.body.appendChild(btn);
  } catch (e) {
    console.error('Errore nel pulsante Chiudi app:', e);
  }
});

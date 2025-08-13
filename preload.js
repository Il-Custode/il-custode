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

(function installGlobalKeys() {
  const KEY = '__ilcustode_keys_installed__';
  if (window[KEY]) return;
  window[KEY] = true;

  window.addEventListener('keydown', (e) => {
    const tgt = e.target;
    const tag = (tgt.tagName || '').toUpperCase();
    if (tgt.isContentEditable) return;

    // ENTER
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

    // TAB
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
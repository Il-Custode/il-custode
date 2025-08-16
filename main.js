// main.js (ESM)
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import keytar from 'keytar';
import updaterPkg from 'electron-updater';
const { autoUpdater } = updaterPkg;

const CREDENTIAL_SERVICE = 'IlCustode-Login';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let connections = [];           // client connessi al server WS (lato Master)
let masterPassword = null;      // password server WS (lato Master)
let wss;                        // WebSocketServer
let playerWS = null;            // connessione WS attiva (lato Player)
let updateDownloaded = false;   // flag per auto update

/* ==========================
   Inject "Back" + label i18n in ogni pagina (tranne welcome/index)
   ========================== */
function installAutoBack(win) {
  const INJECT_BACK_JS = `(function(){
    try {
      // --- Aggiorna uno stack minimale di navigazione per file:// ---
      try {
        var last = sessionStorage.getItem('custode.last') || '';
        sessionStorage.setItem('custode.prev', last);
        sessionStorage.setItem('custode.last', location.href);
      } catch(e) {}

      var p = (location.pathname || '').toLowerCase();

      // --- Traduzioni label ---
      function getLabelBack(){
        try {
          return (window.i18n && typeof window.i18n.t==='function')
            ? (window.i18n.t('common.back') || '⬅ Indietro')
            : '⬅ Indietro';
        } catch(_) { return '⬅ Indietro'; }
      }
      function getLabelLogout(){
        try {
          return (window.i18n && typeof window.i18n.t==='function')
            ? (window.i18n.t('common.logout') || 'Logout')
            : 'Logout';
        } catch(_) { return 'Logout'; }
      }

      function goBackSmart(){
        try {
          if (history.length > 1) { history.back(); return; }
        } catch(e) {}

        var prev = '';
        try { prev = sessionStorage.getItem('custode.prev') || ''; } catch(e) {}
        if (prev && prev !== location.href) { location.href = prev; return; }

        if (document.referrer && document.referrer !== location.href) { location.href = document.referrer; return; }

        var home = p.includes("/pages/") ? "../index.html" : "./index.html";
        location.href = home;
      }
      window.__goBackSmart = goBackSmart;

      var isHomeLike = /(\\/(welcome|index)\\.html)$/i.test(p);

      if (!document.getElementById('auto-back-style')) {
        var st = document.createElement('style');
        st.id = 'auto-back-style';
        st.textContent = ".back-btn{position:absolute;left:20px;top:14px;background-color:#a9745b;color:#fff;font-size:16px;border:none;cursor:pointer;padding:8px 12px;border-radius:8px} .back-btn:hover{background:#8b5e47}";
        document.head.appendChild(st);
      }

      if (!isHomeLike) {
        var existing = document.querySelector('.back-btn');
        if (existing){
          existing.onclick = function(ev){ ev.preventDefault(); goBackSmart(); };
          existing.textContent = getLabelBack();
          existing.setAttribute('data-i18n','common.back');
        } else {
          var btn = document.createElement('button');
          btn.className = 'back-btn';
          btn.setAttribute('data-i18n','common.back');
          btn.textContent = getLabelBack();
          btn.onclick = function(ev){ ev.preventDefault(); goBackSmart(); };
          var header = document.querySelector('header');
          if (header) header.appendChild(btn);
          else {
            btn.style.position = 'fixed';
            btn.style.left = '16px';
            btn.style.top  = '16px';
            btn.style.zIndex = '9999';
            document.body.appendChild(btn);
          }
        }
      }

      function updateCommonLabels(){
        var back = document.querySelector('.back-btn');
        if (back) back.textContent = getLabelBack();

        var logoutEls = [];
        var byId1 = document.getElementById('btnLogout');
        var byId2 = document.getElementById('headerLogout');
        if (byId1) logoutEls.push(byId1);
        if (byId2) logoutEls.push(byId2);
        try { document.querySelectorAll('[data-role="logout"]').forEach(function(el){ logoutEls.push(el); }); } catch(_){}

        logoutEls.forEach(function(el){
          el.textContent = getLabelLogout();
          try { el.setAttribute('data-i18n','common.logout'); } catch(_){}
        });
      }

      updateCommonLabels();
      window.addEventListener('i18n:change', updateCommonLabels);
    } catch(e) { console.warn('auto-back inject error', e); }
  })();`;

  win.webContents.on('did-finish-load', () => {
    try { win.webContents.executeJavaScript(INJECT_BACK_JS); } catch {}
  });
}

/* ==========================
   BrowserWindow helper
   ========================== */
function createWindowWithDefaults({ filePath, width = 1200, height = 800 } = {}) {
  const win = new BrowserWindow({
    width,
    height,
    webPreferences: {
      preload: path.join(__dirname, 'preload-combined.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
  });

  // CSP dev-friendly: permette inline e risorse comuni, ma **senza** 'unsafe-eval'
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [[
          "default-src 'self' data: blob:;",
          "script-src 'self' 'unsafe-inline' blob: https:;",   // <-- rimosso 'unsafe-eval'
          "style-src 'self' 'unsafe-inline';",
          "img-src 'self' data: blob:;",
          "font-src 'self' data:;",
          "media-src 'self' data: blob:;",
          "connect-src 'self' https: http: ws: wss:;",
          "frame-src 'self';"
        ].join(' ')]
      }
    });
  });

  installAutoBack(win);

  if (filePath) {
    win.loadFile(path.join(__dirname, filePath));
  }

  return win;
}

function createWindow() {
  mainWindow = createWindowWithDefaults({ filePath: 'welcome.html' });
}

/* ==========================
   Auto Updater
   ========================== */
function setupAutoUpdater() {
  try {
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on('checking-for-update', () => console.log('Controllo aggiornamenti...'));
    autoUpdater.on('update-available', (info) => console.log('Aggiornamento disponibile:', info.version));
    autoUpdater.on('update-not-available', () => console.log('Nessun aggiornamento trovato'));
    autoUpdater.on('error', (err) => console.error('Errore aggiornamento:', err));
    autoUpdater.on('download-progress', (p) => console.log(`Download: ${Math.round(p.percent)}%`));

    autoUpdater.on('update-downloaded', (info) => {
      updateDownloaded = true;
      console.log('Aggiornamento scaricato:', info?.version, '— sarà installato alla chiusura dell’app.');
    });

    autoUpdater.checkForUpdatesAndNotify();
  } catch (e) {
    console.warn('AutoUpdater non disponibile:', e?.message || e);
  }
}

/* ==========================
   App lifecycle
   ========================== */
app.whenReady().then(() => {
  app.setAppUserModelId('com.ilcustode.app');

  const gotLock = app.requestSingleInstanceLock();
  if (!gotLock) {
    app.quit();
    return;
  }
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  createWindow();
  setupAutoUpdater();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  try {
    if (wss) {
      for (const client of wss.clients) {
        try { client.terminate(); } catch {}
      }
      wss.close();
    }
  } catch {}

  if (updateDownloaded) {
    try {
      autoUpdater.quitAndInstall(false, true);
    } catch (e) {
      console.error('quitAndInstall error:', e);
    }
  }
});

/* ==========================
   Credenziali (keytar)
   ========================== */
ipcMain.handle('cred:get', async (_event, email) => {
  if (!email) return '';
  try {
    const pwd = await keytar.getPassword(CREDENTIAL_SERVICE, email);
    return pwd || '';
  } catch {
    return '';
  }
});

ipcMain.handle('cred:set', async (_event, { email, password }) => {
  if (!email || !password) return false;
  try {
    await keytar.setPassword(CREDENTIAL_SERVICE, email, password);
    return true;
  } catch {
    return false;
  }
});

ipcMain.handle('cred:clear', async () => {
  try {
    const creds = await keytar.findCredentials(CREDENTIAL_SERVICE);
    await Promise.all(creds.map((c) => keytar.deletePassword(CREDENTIAL_SERVICE, c.account)));
    return true;
  } catch {
    return false;
  }
});

/* ==========================
   WebSocket / Chat (MVP)
   ========================== */
// Avvia server (Master)
ipcMain.on('start-server', (_event, password) => {
  masterPassword = password;
  try {
    wss = new WebSocketServer({ port: 8080 });
    console.log(`Server avviato su porta 8080 con password: ${password}`);
  } catch (e) {
    console.error('Errore avvio server WS:', e);
    return;
  }

  wss.on('connection', (ws) => {
    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'auth') {
          if (msg.password === masterPassword) {
            ws.isAuthenticated = true;
            connections.push(ws);
            broadcastPlayerList();
            ws.send(JSON.stringify({ type: 'auth', success: true }));
            console.log('Nuovo giocatore connesso');
          } else {
            ws.send(JSON.stringify({ type: 'auth', success: false }));
            ws.close();
          }
        }
        if (msg.type === 'chat' && ws.isAuthenticated) {
          broadcast({ type: 'chat', message: msg.message });
        }
      } catch {}
    });

    ws.on('close', () => {
      connections = connections.filter((c) => c !== ws);
      broadcastPlayerList();
    });
  });
});

// Connetti come Player (supporta due nomi canale diversi)
function connectToServer({ ip, password }) {
  try {
    playerWS?.close?.();
  } catch {}
  playerWS = null;

  const ws = new WebSocket(`ws://${ip}:8080`);
  ws.on('open', () => {
    ws.send(JSON.stringify({ type: 'auth', password }));
  });
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'auth' && !msg.success) {
        console.log('Connessione rifiutata: password errata');
        ws.close();
      }
      if (msg.type === 'chat') {
        mainWindow?.webContents.send('chat-message', msg.message);
      }
      if (msg.type === 'player-list') {
        mainWindow?.webContents.send('update-player-list', msg.count);
      }
    } catch {}
  });
  ws.on('close', () => {
    if (playerWS === ws) playerWS = null;
  });
  playerWS = ws;
}

ipcMain.on('connect-server', (_event, { ip, password }) => {
  connectToServer({ ip, password });
});
ipcMain.on('connect-to-server', (_event, { ip, pwd }) => {
  connectToServer({ ip, password: pwd });
});

ipcMain.on('chat-message', (_e, message) => {
  try {
    if (playerWS && playerWS.readyState === WebSocket.OPEN) {
      playerWS.send(JSON.stringify({ type: 'chat', message }));
    }
  } catch {}
});

function broadcast(data) {
  const msg = JSON.stringify(data);
  connections.forEach((c) => {
    if (c.readyState === WebSocket.OPEN) c.send(msg);
  });
}

function broadcastPlayerList() {
  broadcast({ type: 'player-list', count: connections.length });
}

/* ==========================
   Navigazione multi-pagina
   ========================== */
ipcMain.on('open-page', (_event, page) => {
  createWindowWithDefaults({ filePath: page, width: 1000, height: 700 });
});

/* ==========================
   Chiusura completa app
   ========================== */
ipcMain.on('close-app', () => {
  BrowserWindow.getAllWindows().forEach((w) => w.destroy());
  app.quit();
});

// main.js (ESM)
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
let connections = [];
let masterPassword = null;
let wss;

// === FLAG aggiornamento scaricato ===
let updateDownloaded = false;

/* ==========================
   Inject "Indietro" auto in ogni pagina (tranne welcome/index)
   ========================== */
function installAutoBack(win) {
  const INJECT_BACK_JS = `(function(){
    try {
      // Non iniettare su welcome/index
      var p = (location.pathname || '').toLowerCase();
      if (/(^|\\/)(welcome|index)\\.html$/.test(p)) return;

      // Stili base del pulsante (una volta sola)
      if (!document.getElementById('auto-back-style')) {
        var st = document.createElement('style');
        st.id = 'auto-back-style';
        st.textContent = ".back-btn{position:absolute;left:20px;top:14px;background-color:#a9745b;color:#fff;font-size:16px;border:none;cursor:pointer;padding:8px 12px;border-radius:8px} .back-btn:hover{background:#8b5e47}";
        document.head.appendChild(st);
      }

      // Funzione di ritorno "smart"
      function goBackSmart(){
        var hasReferrer = !!document.referrer && document.referrer !== location.href;
        var hasHistory = window.history.length > 1;
        if (hasReferrer || hasHistory) {
          try { history.back(); return; } catch(e){}
        }
        // Fallback: torna all'index in base al path corrente
        var home = p.includes("/pages/") ? "../index.html" : "./index.html";
        location.href = home;
      }
      // Esponi per eventuale uso da altri script
      window.__goBackSmart = goBackSmart;

      // Re-wiring: qualunque .back-btn esistente userà goBackSmart()
      document.querySelectorAll('.back-btn').forEach(function(btn){
        btn.onclick = function(ev){ ev.preventDefault(); goBackSmart(); };
      });

      // Se NON esiste un .back-btn, lo creo e lo metto nell'header o flottante
      if (!document.querySelector('.back-btn')) {
        var btn = document.createElement('button');
        btn.className = 'back-btn';
        btn.textContent = '⬅ Indietro';
        btn.onclick = function(ev){ ev.preventDefault(); goBackSmart(); };

        var header = document.querySelector('header');
        if (header) { header.appendChild(btn); }
        else {
          btn.style.position = 'fixed';
          btn.style.left = '16px';
          btn.style.top = '16px';
          btn.style.zIndex = '9999';
          document.body.appendChild(btn);
        }
      }
    } catch(e){ console.warn('auto-back inject error', e); }
  })();`;

  // Esegui l'iniezione a OGNI caricamento pagina di questa finestra
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

  // Inietta il pulsante "Indietro" auto (esclude welcome/index)
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
   Auto Updater: installa ALLA CHIUSURA (X) senza prompt
   ========================== */
function setupAutoUpdater() {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true; // chiudi l’app (X) = installa update

  autoUpdater.on('checking-for-update', () => console.log('Controllo aggiornamenti...'));
  autoUpdater.on('update-available', (info) => console.log('Aggiornamento disponibile:', info.version));
  autoUpdater.on('update-not-available', () => console.log('Nessun aggiornamento trovato'));
  autoUpdater.on('error', (err) => console.error('Errore aggiornamento:', err));
  autoUpdater.on('download-progress', (p) => console.log(`Download: ${Math.round(p.percent)}%`));

  autoUpdater.on('update-downloaded', (info) => {
    updateDownloaded = true;
    console.log('Aggiornamento scaricato:', info?.version, '— sarà installato alla chiusura dell’app.');
    // Nessun dialog: lasciamo che si installi alla chiusura
  });

  autoUpdater.checkForUpdatesAndNotify();
}

/* ==========================
   App lifecycle
   ========================== */
app.whenReady().then(() => {
  app.setAppUserModelId('com.ilcustode.app');

  // singola istanza (evita doppie esecuzioni durante update)
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

// Chiudi davvero l’app su Windows quando tutte le finestre sono chiuse
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Prima di uscire: chiudi server/socket e, se necessario, installa update
app.on('before-quit', () => {
  try {
    if (wss) {
      for (const client of wss.clients) {
        try { client.terminate(); } catch {}
      }
      wss.close();
    }
  } catch {}

  // Se l’aggiornamento è stato scaricato, forza l’installazione adesso
  if (updateDownloaded) {
    try {
      autoUpdater.quitAndInstall(false, true); // isSilent=false, isForceRunAfter=true
    } catch (e) {
      console.error('quitAndInstall error:', e);
    }
  }
});

/* ==========================
   CREDENZIALI (keytar)
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
   WEBSOCKET / CHAT (MVP)
   ========================== */
ipcMain.on('start-server', (_event, password) => {
  masterPassword = password;
  wss = new WebSocketServer({ port: 8080 });
  console.log(`Server avviato su porta 8080 con password: ${password}`);

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

ipcMain.on('connect-server', (_event, { ip, password }) => {
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
  ipcMain.on('chat-message', (_e, message) => {
    try {
      ws.send(JSON.stringify({ type: 'chat', message }));
    } catch {}
  });
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
   NAVIGAZIONE MULTI-PAGINA
   ========================== */
ipcMain.on('open-page', (_event, page) => {
  createWindowWithDefaults({ filePath: page, width: 1000, height: 700 });
});

/* ==========================
   CHIUSURA COMPLETA APP
   ========================== */
ipcMain.on('close-app', () => {
  BrowserWindow.getAllWindows().forEach((w) => w.destroy());
  app.quit(); // 'before-quit' gestisce l'update se scaricato
});
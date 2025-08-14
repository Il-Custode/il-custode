// main.js (ESM) — X chiude davvero tutta l'app
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
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

// <<< NEW: flag che impedisce comportamenti strani durante la chiusura
let quitting = false;

// Helper per creare finestre con il preload "combinato" (tuo)
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

  if (filePath) {
    win.loadFile(path.join(__dirname, filePath));
  }

  return win;
}

function createWindow() {
  mainWindow = createWindowWithDefaults({ filePath: 'welcome.html' });
}

function setupAutoUpdater() {
  autoUpdater.on('checking-for-update', () => console.log('Controllo aggiornamenti...'));
  autoUpdater.on('update-available', (info) => console.log('Aggiornamento disponibile:', info.version));
  autoUpdater.on('update-not-available', () => console.log('Nessun aggiornamento trovato'));
  autoUpdater.on('error', (err) => console.error('Errore aggiornamento:', err));
  autoUpdater.on('download-progress', (p) => console.log(`Download: ${Math.round(p.percent)}%`));
  autoUpdater.on('update-downloaded', async () => {
    const { response } = await dialog.showMessageBox({
      type: 'question',
      buttons: ['Riavvia ora', 'Più tardi'],
      defaultId: 0,
      cancelId: 1,
      message: 'Aggiornamento scaricato',
      detail: 'Vuoi riavviare l’app per completare l’installazione?',
    });
    if (response === 0) autoUpdater.quitAndInstall();
  });
  autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(() => {
  app.setAppUserModelId('com.ilcustode.app');
  createWindow();
  setupAutoUpdater();

  // Su mac, se l’app è già aperta e non stiamo chiudendo, ricrea la finestra
  app.on('activate', () => {
    if (quitting) return;
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

/* =======================
   X CHIUDE DAVVERO L'APP
   ======================= */
// Qualsiasi finestra venga creata: se si clicca la X, chiudi tutta l’app (anche su macOS)
app.on('browser-window-created', (_evt, win) => {
  win.on('close', () => {
    if (!quitting) {
      quitting = true;
      // chiudi server e connessioni prima di uscire
      try { wss?.close(); } catch {}
      app.quit();
    }
  });
});

// Quando tutte le finestre risultano chiuse, termina comunque l’app su tutti i sistemi
app.on('window-all-closed', () => {
  // niente condizione su macOS: vogliamo chiudere davvero
  app.quit();
});

// Segnala che stiamo chiudendo (evita riaperture involontarie)
app.on('before-quit', () => {
  quitting = true;
  try { wss?.close(); } catch {}
});

/* ============ CREDENZIALI (keytar) ============ */
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

/* ============ WEBSOCKET / CHAT ============ */
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

/* ============ NAVIGAZIONE MULTI-PAGINA ============ */
ipcMain.on('open-page', (_event, page) => {
  createWindowWithDefaults({ filePath: page, width: 1000, height: 700 });
});

/* ============ CHIUSURA COMPLETA APP (via bottone, se lo usi ancora) ============ */
ipcMain.on('close-app', () => {
  quitting = true;
  try { wss?.close(); } catch {}
  // Chiudi tutte le finestre e termina l'app
  BrowserWindow.getAllWindows().forEach(w => {
    try { w.destroy(); } catch {}
  });
  app.quit();
});
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { autoUpdater } from 'electron-updater';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let connections = [];
let masterPassword = null;
let wss;

/* =========================
   Finestra principale
   ========================= */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // pagina iniziale
  mainWindow.loadFile(path.join(__dirname, 'welcome.html'));
}

/* =========================
   Auto-update (electron-updater)
   ========================= */
function setupAutoUpdater() {
  // Log basilari (vedi output con: npm start)
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
      detail: 'Vuoi riavviare l’app per completare l’installazione?'
    });
    if (response === 0) autoUpdater.quitAndInstall();
  });

  // Avvia il controllo (notifica l’utente e scarica se c’è una release nuova su GitHub)
  autoUpdater.checkForUpdatesAndNotify();
}

/* =========================
   App lifecycle
   ========================= */
app.whenReady().then(() => {
  // Consigliato su Windows per toast / updater
  app.setAppUserModelId('com.ilcustode.app');

  createWindow();
  setupAutoUpdater();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

/* =========================
   WebSocket "Master" server (MVP locale)
   ========================= */
ipcMain.on('start-server', (event, password) => {
  masterPassword = password;
  wss = new WebSocketServer({ port: 8080 });
  console.log(`Server avviato su porta 8080 con password: ${password}`);

  wss.on('connection', (ws) => {
    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());

        // Auth iniziale
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

        // Chat broadcast
        if (msg.type === 'chat' && ws.isAuthenticated) {
          broadcast({ type: 'chat', message: msg.message });
        }
      } catch (err) {
        console.error('Errore messaggio:', err);
      }
    });

    ws.on('close', () => {
      connections = connections.filter(c => c !== ws);
      broadcastPlayerList();
    });
  });
});

/* =========================
   Client "Giocatore"
   ========================= */
ipcMain.on('connect-to-server', (event, { ip, pwd }) => {
  const ws = new WebSocket(`ws://${ip}:8080`);

  ws.on('open', () => {
    ws.send(JSON.stringify({ type: 'auth', password: pwd }));
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
    } catch (err) {
      console.error('Errore ricezione:', err);
    }
  });

  // chat in uscita dal renderer
  ipcMain.on('chat-message', (_event, message) => {
    try { ws.send(JSON.stringify({ type: 'chat', message })); } catch {}
  });
});

/* =========================
   Utils WS
   ========================= */
function broadcast(data) {
  const msg = JSON.stringify(data);
  connections.forEach(c => {
    if (c.readyState === WebSocket.OPEN) c.send(msg);
  });
}
function broadcastPlayerList() {
  broadcast({ type: 'player-list', count: connections.length });
}

/* =========================
   Apri altre pagine (finestre figlie)
   ========================= */
ipcMain.on('open-page', (_event, page) => {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  win.loadFile(path.join(__dirname, page));
});
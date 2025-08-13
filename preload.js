const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Avvio server LAN
    startServer: (password) => ipcRenderer.send('start-server', password),

    // Connessione client
    connectToServer: (ip, password) => ipcRenderer.send('connect-server', { ip, password }),

    // Apri altra pagina
    openPage: (page) => ipcRenderer.send('open-page', page),

    // Chat
    sendChatMessage: (message) => ipcRenderer.send('chat-message', message),
    onChatMessage: (callback) => ipcRenderer.on('chat-message', (event, msg) => callback(msg)),

    // Lista giocatori
    onPlayerListUpdate: (callback) => ipcRenderer.on('update-player-list', (event, players) => callback(players))
});
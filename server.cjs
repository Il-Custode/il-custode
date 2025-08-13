const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const QRCode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Campagne attive
let campaigns = {};

// Servire i file statici dell'app
app.use(express.static(__dirname));

// API per creare una nuova campagna
app.get('/create-campaign/:name', async (req, res) => {
    const campaignName = req.params.name;
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    campaigns[pin] = { name: campaignName, players: [] };

    // Genera QR Code con il PIN
    const qrCode = await QRCode.toDataURL(pin);
    res.json({ pin, qrCode });
});

// Gestione delle connessioni socket
io.on('connection', (socket) => {
    console.log('Nuovo client connesso');

    socket.on('joinCampaign', ({ pin, playerName }) => {
        if (campaigns[pin]) {
            campaigns[pin].players.push(playerName);
            socket.join(pin);
            io.to(pin).emit('playerJoined', playerName);
            console.log(`${playerName} si è unito alla campagna ${campaigns[pin].name}`);
        } else {
            socket.emit('error', 'PIN non valido');
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnesso');
    });
});

// Avvio server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});
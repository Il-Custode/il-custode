// --------- VISTE ---------
function view_home(){
  return `
    <h1>Benvenuto in Il Custode</h1>
    <p class="small">Versione PC — base pronta. Interfaccia uguale ad Android.</p>

    <div class="card" style="margin-top:12px">
      <b>Stato:</b>
      <ul>
        <li>Tema pergamena attivo</li>
        <li>Sidebar (Home, Sessione, Musica, Progetti, Appunti, Tutorial, Impostazioni)</li>
        <li>Sincronizzazione LAN pronta al test</li>
      </ul>

      <button id="openNewWin" style="margin-top:8px; padding:8px 12px; border-radius:10px; border:1px solid #0001; background:#fff;">
        Apri nuova finestra
      </button>
      <div class="small" style="opacity:.8; margin-top:6px;">
        Usa questo per avere Master e Giocatore sullo stesso PC durante il test.
      </div>
    </div>
  `;
}

function view_sessione(){
  return `
    <h1>Sessione Locale</h1>
    <p class="small">Condividi uno degli indirizzi con i giocatori sulla stessa rete.</p>

    <div class="card" style="margin-top:12px">
      <h3>Master</h3>
      <button id="btnMasterStart" style="padding:8px 12px; border-radius:10px; border:1px solid #0001; background:#fff;">Crea sessione (avvia LAN)</button>
      <button id="btnMasterStop" style="padding:8px 12px; border-radius:10px; border:1px solid #0001; background:#fff; margin-left:6px;">Ferma sessione</button>
      <div id="masterInfo" class="small" style="margin-top:8px; opacity:.9;"></div>

      <div style="margin-top:10px;">
        <input id="broadcastTxt" placeholder="Messaggio ai giocatori" style="padding:8px; border-radius:8px; border:1px solid #0001; width:60%;">
        <button id="broadcastBtn" style="padding:8px 12px; border-radius:10px; border:1px solid #0001; background:#fff;">Invia</button>
      </div>
    </div>

    <div class="card" style="margin-top:12px">
      <h3>Giocatore</h3>
      <div class="small">Inserisci IP:porta del Master (es. 127.0.0.1:8777 per test sullo stesso PC)</div>
      <input id="joinTarget" placeholder="es. 192.168.1.50:8777" style="padding:8px; border-radius:8px; border:1px solid #0001; width:60%; margin-top:6px;">
      <div style="margin-top:8px;">
        <button id="btnJoin" style="padding:8px 12px; border-radius:10px; border:1px solid #0001; background:#fff;">Unisciti</button>
        <button id="btnLeave" style="padding:8px 12px; border-radius:10px; border:1px solid #0001; background:#fff; margin-left:6px;">Lascia</button>
      </div>
      <div id="joinInfo" class="small" style="margin-top:8px; opacity:.9;"></div>
      <div id="log" class="small" style="margin-top:8px;"></div>
    </div>
  `;
}

function view_musica(){ return `<h1>Musica</h1><p class="small">Qui metteremo player e playlist (ogg/mp3).</p>`; }
function view_progetti(){ return `<h1>Progetti</h1><p class="small">Cartelle e file della campagna.</p>`; }
function view_appunti(){ return `<h1>Appunti</h1><p class="small">Note locali e condivise.</p>`; }
function view_tutorial(){ return `<h1>Tutorial</h1><p class="small">Guida narrativa iniziale.</p>`; }
function view_impostazioni(){ return `<h1>Impostazioni</h1><p class="small">Lingua, backup, password Master.</p>`; }

// --------- ROUTER ---------
function goto(route){
  const v = document.getElementById('view');
  const links = document.querySelectorAll('.nav a');
  links.forEach(a => a.classList.toggle('active', a.dataset.route === route));

  switch(route){
    case 'sessione': v.innerHTML = view_sessione(); break;
    case 'musica': v.innerHTML = view_musica(); break;
    case 'progetti': v.innerHTML = view_progetti(); break;
    case 'appunti': v.innerHTML = view_appunti(); break;
    case 'tutorial': v.innerHTML = view_tutorial(); break;
    case 'impostazioni': v.innerHTML = view_impostazioni(); break;
    default: v.innerHTML = view_home(); route = 'home'; break;
  }

  // HOME: bottone per aprire una nuova finestra
  if (route === 'home') {
    const btn = document.getElementById('openNewWin');
    if (btn && window.electronAPI?.openNewWindow) {
      btn.addEventListener('click', () => window.electronAPI.openNewWindow());
    }
  }

  // SESSIONE: collega i pulsanti
  if (route === 'sessione') setupSessionPage();

  window.currentRoute = route;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav a').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      goto(a.dataset.route);
    });
  });
  goto('home');
});

// --------- LOGICA SESSIONE (LAN) ---------
let ws = null; // client (Giocatore)

function setupSessionPage(){
  const btnStart = document.getElementById('btnMasterStart');
  const btnStop  = document.getElementById('btnMasterStop');
  const info     = document.getElementById('masterInfo');
  const bTxt     = document.getElementById('broadcastTxt');
  const bBtn     = document.getElementById('broadcastBtn');

  const joinTarget = document.getElementById('joinTarget');
  const btnJoin = document.getElementById('btnJoin');
  const btnLeave = document.getElementById('btnLeave');
  const joinInfo = document.getElementById('joinInfo');
  const log = document.getElementById('log');

  if (btnStart) btnStart.addEventListener('click', async () => {
    const res = await window.electronAPI.startSession();
    const addresses = [
      ...(Array.isArray(res.ips) ? res.ips.map(ip => `${ip}:${res.port}`) : []),
      `${res.localhost}:${res.port}`
    ];

    info.innerHTML = `
      <b>Server LAN attivo</b><br>
      <b>Codice:</b> ${res.code}<br>
      <b>Indirizzi disponibili da dare ai giocatori:</b>
      <ul style="margin-top:6px;">
        ${addresses.map(a => `<li>${a}</li>`).join('')}
      </ul>
      <div class="small" style="opacity:.85;">Suggerimento: se siete sullo stesso PC, usa ${res.localhost}:${res.port}</div>
    `;

    // Precompila il campo con il primo indirizzo utile
    if (joinTarget && (!joinTarget.value || joinTarget.value.trim() === '')) {
      joinTarget.value = addresses[0] || `${res.localhost}:${res.port}`;
    }
  });

  if (btnStop) btnStop.addEventListener('click', async () => {
    await window.electronAPI.stopSession();
    info.innerHTML = `Server fermato.`;
  });

  if (bBtn) bBtn.addEventListener('click', async () => {
    const text = (bTxt.value || '').trim();
    if (!text) return;
    await window.electronAPI.broadcastToPlayers(text);
    const p = document.createElement('div');
    p.textContent = `[Master] ${text}`;
    log.appendChild(p);
    bTxt.value = '';
  });

  if (btnJoin) btnJoin.addEventListener('click', () => {
    const target = (joinTarget.value || '').trim();
    if (!target) {
      joinInfo.textContent = 'Inserisci IP:porta del Master.';
      return;
    }
    try {
      ws = new WebSocket(`ws://${target}`);
      joinInfo.textContent = 'Connessione in corso...';

      ws.onopen = () => { joinInfo.textContent = 'Connesso al Master.'; };
      ws.onmessage = (ev) => {
        const p = document.createElement('div');
        try {
          const data = JSON.parse(ev.data);
          if (data.type === 'master') p.textContent = `[Master] ${data.text}`;
          else if (data.type === 'info') p.textContent = `[Info] ${data.text}`;
          else p.textContent = `[Msg] ${ev.data}`;
        } catch {
          p.textContent = `[Msg] ${ev.data}`;
        }
        log.appendChild(p);
      };
      ws.onclose = () => { joinInfo.textContent = 'Disconnesso.'; };
      ws.onerror = () => { joinInfo.textContent = 'Errore di connessione.'; };
    } catch {
      joinInfo.textContent = 'Indirizzo non valido.';
    }
  });

  if (btnLeave) btnLeave.addEventListener('click', () => {
    if (ws) {
      try { ws.close(); } catch {}
      ws = null;
    }
    joinInfo.textContent = 'Disconnesso.';
  });
}
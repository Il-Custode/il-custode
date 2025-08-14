// Go back "smart": se c'è una pagina precedente nel contesto, torna lì; altrimenti vai all'index.
window.goBackSmart = function() {
  const hasReferrer = !!document.referrer && document.referrer !== location.href;
  const hasHistory = window.history.length > 1;

  if (hasReferrer || hasHistory) {
    // Evita errori se la ref viene da un altro origin
    try { history.back(); return; } catch {}
  }
  // Fallback: torna alla home (metti il path che usi come home)
  const home = (document.body.getAttribute('data-home')) || './index.html';
  window.location.href = home;
};

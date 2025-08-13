// renderer.js
(function () {
  const $ = (s) => document.querySelector(s);

  const btnNote = $('#openNote');
  const btnMap  = $('#openMap');

  btnNote?.addEventListener('click', () => {
    // chiama l'IPC esposto dal preload
    window.electronAPI?.openNote();
  });

  btnMap?.addEventListener('click', () => {
    window.electronAPI?.openMap();
  });
})();
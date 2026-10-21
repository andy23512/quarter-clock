const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('clock', {
  showMenu: () => ipcRenderer.send('show-menu'),
});

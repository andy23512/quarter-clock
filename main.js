const { app, BrowserWindow, Menu, ipcMain, screen } = require('electron');
const fs = require('fs');
const path = require('path');

const SIZE = 240;
const OPACITY = 0.5;

const statePath = () => path.join(app.getPath('userData'), 'window-state.json');

// 保存した位置を読み込む。無い・壊れている・どのディスプレイにも収まらない場合は undefined
function loadPosition() {
  try {
    const { x, y } = JSON.parse(fs.readFileSync(statePath(), 'utf-8'));
    if (!Number.isFinite(x) || !Number.isFinite(y)) return undefined;
    const visible = screen.getAllDisplays().some(({ workArea: a }) =>
      x >= a.x && y >= a.y && x + SIZE <= a.x + a.width && y + SIZE <= a.y + a.height);
    return visible ? { x, y } : undefined;
  } catch {
    return undefined;
  }
}

function savePosition(win) {
  const [x, y] = win.getPosition();
  fs.writeFileSync(statePath(), JSON.stringify({ x, y }));
}

function createWindow() {
  const win = new BrowserWindow({
    ...loadPosition(),
    width: SIZE,
    height: SIZE,
    frame: false,
    transparent: true,
    resizable: false,
    hasShadow: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.setOpacity(OPACITY);
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.loadFile('index.html');

  // 終了時(右クリックの「終了」を含む)に位置を保存する
  win.on('close', () => savePosition(win));
}

ipcMain.on('show-menu', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  Menu.buildFromTemplate([{ label: '終了', click: () => app.quit() }]).popup({ window: win });
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());

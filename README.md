# Quarter Clock

只有分針的桌面時鐘。鐘面分成四等分，第二與第四等分（15～30 分、45～60 分）是休息時間。

## 功能

- 只有分針，沒有時針與秒針（分針會隨秒數平滑移動）
- 鐘面四等分，邊界以淡線標示
- **休息時間**（15～30 分、45～60 分）：這兩個等分塗綠色，其餘塗黑色，鐘面中間顯示「休息中」
- **非休息時間**：整個鐘面全黑，不顯示文字
- 無邊框、背景透明、整體透明度 50%、永遠置頂（顯示在所有工作區）
- 可用滑鼠拖曳移動，關閉時會記住位置，下次開啟時回到同一個位置
- 在時鐘上按右鍵，選「終了」即可關閉

## 使用方式

需要 [Node.js](https://nodejs.org/)。

```sh
npm install
npm start
```

## 打包

```sh
npm run package
```

會使用 [`@electron/packager`](https://github.com/electron/packager) 在 `dist/` 產生 macOS 的 `QuarterClock.app`（架構與執行打包的機器相同，例如 Apple Silicon 會是 arm64）。

目前沒有做程式碼簽署與公證（notarization），把 `.app` 給其他電腦使用時，Gatekeeper 可能會出現警告。

## 設定

目前沒有設定介面，需要時直接修改程式碼：

| 項目 | 位置 |
| --- | --- |
| 透明度（預設 `0.5`） | `main.js` 的 `OPACITY` |
| 視窗大小（預設 `240`） | `main.js` 的 `SIZE`，以及 `index.html` 中 canvas 的 `width` / `height` |
| 休息時間範圍 | `renderer.js` 的 `REST_RANGES` |
| 顏色 | `renderer.js` 的 `BLACK` / `GREEN` / `WHITE` |

## 位置記憶

關閉時會把視窗位置存成 Electron `userData` 資料夾中的 `window-state.json`（macOS 位於 `~/Library/Application Support/` 底下）。如果存下的位置已不在任何螢幕內（例如拔掉外接螢幕），會改用預設位置開啟。強制結束或當機時不會更新位置。

## 已知限制

- 只在 macOS 上建置與啟動確認過，其他平台未驗證
- 「固定在桌面」是以永遠置頂實現，並非放在其他視窗後面的桌布式顯示

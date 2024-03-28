import { ipcMain, BrowserWindow } from 'electron'

export async function useCanvasRecord(canvasRecorderWin: BrowserWindow) {
  ipcMain.handle('canvas:start', () => {
    canvasRecorderWin.show()
  })

  ipcMain.handle('canvas:hide', () => {
    canvasRecorderWin.hide()
  })

  ipcMain.handle('canvas:startRecord', () => {
  })

  ipcMain.handle('canvas:stop', () => {
  })
}

import type { BrowserWindow } from 'electron'
import { ipcMain } from 'electron'

// fixme: 目前只能支持一个窗口调用 因为drag api写死了
export function useDrag(win: BrowserWindow) {
  // listen drag event
  ipcMain.handle('drag', (event, opt: { x: number, y: number }) => {
    // get current window position
    const [x, y] = win.getPosition()
    // move window to new position
    win.setPosition(x + opt.x, y + opt.y)
  })
}

export function useCanvasDrag(win: BrowserWindow) {
  // listen drag event
  ipcMain.handle('canvas:drag', (event, opt: { x: number, y: number }) => {
    // get current window position
    const [x, y] = win.getPosition()
    // move window to new position
    win.setPosition(x + opt.x, y + opt.y)
  })
}

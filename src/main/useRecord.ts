import { ipcMain, BrowserWindow } from 'electron'
import { useFFMPEG } from './utils/useFFMPEG'

const ffmpeg = useFFMPEG()

// use ffmpeg to start recording
export async function useRecord(userClipWin: BrowserWindow) {
  ipcMain.handle('start', () => {
    userClipWin.show()
  })

  ipcMain.handle('startRecord', (e, recordOptions: RecordOptions) => {
    ffmpeg.startRecord(recordOptions)
  })

  ipcMain.handle('stop', () => {
    // 停止录制
    ffmpeg.stopRecord()
    // 关闭窗口发送事件
    userClipWin.webContents.send('close-win')
    // 将窗口不再设置成可穿透
    userClipWin.setIgnoreMouseEvents(false)
    // 关闭窗口
    userClipWin.hide()
    // 获取所有窗口
    const allWindows = BrowserWindow.getAllWindows()
    // 遍历所有窗口发送状态改变的消息
    allWindows.forEach((win) => {
      win.webContents.send('change-icon', false) // change-icon 的 msg 是 boolean
    })
  })

  ipcMain.handle('hide', () => {
    // 开始录制前可隐藏窗口
    userClipWin.hide()
  })

  ipcMain.handle('transparentClipWin', () => {
    // 设置窗口为可穿透
    userClipWin.setIgnoreMouseEvents(true)
  })

  ipcMain.on('message', (event, { type, msg }) => {
    // 发送给 摄像头的渲染进程 改变icon状态
    console.log('message', type, msg)
    if (type === 'change-icon') {
      // 遍历所有窗口发送状态改变的消息
      const allWindows = BrowserWindow.getAllWindows()
      allWindows.forEach((win) => {
        win.webContents.send('change-icon', msg) // change-icon 的 msg 是 boolean
      })
    }
  })
}

import type { BrowserWindow } from 'electron'
import { ipcMain } from 'electron'
import { useFFMPEG } from './useFFMPEG'

const ffmpeg = useFFMPEG()

// use ffmpeg to start recording
export async function useRecord(userClipWin: BrowserWindow, userRecorderWin: BrowserWindow) {
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
    // 在进程成功关闭之后 通知icon改变 给user recorder渲染进程发送消息
    userRecorderWin.webContents.send('change-icon', false)
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
      // 给user recorder渲染进程发送消息
      userRecorderWin.webContents.send('change-icon', msg as boolean) // change-icon 的 msg 是 boolean
    }
  })
}

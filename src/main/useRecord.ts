import { spawn } from 'node:child_process'
import type { ChildProcessWithoutNullStreams } from 'node:child_process'
import type { BrowserWindow } from 'electron'
import { ipcMain } from 'electron'
import kill from 'tree-kill'

// ffmpeg
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffprobePath from '@ffprobe-installer/ffprobe'
import ffmpeg from 'fluent-ffmpeg'

import { getPlatform } from './utils'

ffmpeg.setFfmpegPath(ffmpegPath.path)
ffmpeg.setFfprobePath(ffprobePath.path)

let recorderProcess: ChildProcessWithoutNullStreams

// use ffmpeg to start recording
export async function useRecord(userClipWin: BrowserWindow, userRecorderWin: BrowserWindow) {
  const platform = getPlatform()

  ipcMain.handle('start', () => {
    userClipWin.show()
  })

  ipcMain.handle('startRecord', (e, recordOptions: RecordOptions) => {
    const filename = `${new Date().getTime()}.mp4`
    let ffmpeg_command = ''

    // 宽高/坐标 以及屏幕缩放比例
    const { width, height, x, y } = recordOptions

    if (platform === 'mac') {
      if (recordOptions.fullScreen) {
        ffmpeg_command = `
        ffmpeg -f avfoundation \
        -capture_cursor 1 \
        -i "1" \
        -c:v libx264 \
        -r 30 \
        -preset ultrafast ~/desktop/${filename}
      `
      }
      else {
        ffmpeg_command = `
        ffmpeg -f avfoundation \
        -capture_cursor 1 \
        -i "1" \
        -video_size ${width}x${height} \
        -vf "crop=${width}:${height}:${x}:${y}" \
        -c:v libx264 \
        -r 30 \
        -preset ultrafast ~/desktop/${filename}
      `
      }
    }
    if (platform === 'win') {
      // todo windows
    }
    const child = spawn(ffmpeg_command, { shell: true })
    child.stdout.on('data', data => console.log(`stdout: ${data}`))
    child.stderr.on('data', data => console.error(`stderr: ${data}`))
    child.on('close', code => console.log(`child process exited with code ${code}`))

    recorderProcess = child
  })

  ipcMain.handle('stop', () => {
    kill(recorderProcess.pid as number, 'SIGINT', (err) => {
      if (err)
        return console.log(`[recorder error]:${err}`)
      userClipWin.webContents.send('close-win')
      // 将窗口不再设置成可穿透
      userClipWin.setIgnoreMouseEvents(false)
      // 关闭窗口
      userClipWin.hide()
      // 在进程成功关闭之后 通知icon改变 给user recorder渲染进程发送消息
      userRecorderWin.webContents.send('change-icon', false)
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
      // 给user recorder渲染进程发送消息
      userRecorderWin.webContents.send('change-icon', msg as boolean) // change-icon 的 msg 是 boolean
    }
  })
}

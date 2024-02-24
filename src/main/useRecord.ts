import { spawn } from 'node:child_process'
import type { ChildProcessWithoutNullStreams } from 'node:child_process'
import type { BrowserWindow } from 'electron'
import { ipcMain } from 'electron'
import kill from 'tree-kill'
import { getPlatform } from './utils'

let recorderProcess: ChildProcessWithoutNullStreams

// use ffmpeg to start recording
export async function useRecord(win: BrowserWindow) {
  const platform = getPlatform()

  ipcMain.handle('start', () => {
    console.log('start')
    win.show()
  })

  ipcMain.handle('startRecord', () => {
    const filename = `${new Date().getTime()}.mp4`
    let ffmpeg_command = ''

    if (platform === 'mac') {
      ffmpeg_command = `
        ffmpeg -f avfoundation \
        -capture_cursor 1 \
        -i "1" \
        -c:v libx264 \
        -r 30 \
        -preset ultrafast ~/desktop/${filename}
      `
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
        console.log(err)
      else
        console.log('recorder process killed')
    })
  })

  ipcMain.handle('hide', () => {
    // 开始录制前可隐藏窗口
    win.hide()
  })

  ipcMain.on('message', (event, { type, msg }) => {
    // 发送给 摄像头的渲染进程 改变icon状态
    console.log('message', type, msg)
    if (type === 'change-icon')
      event.sender.send('changeIcon', msg === 'recording')
  })
}

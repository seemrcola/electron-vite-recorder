import type { BrowserWindow } from 'electron'
import { ipcMain } from 'electron'
import kill from 'tree-kill'
import { getPlatform } from './utils'

// let recorderProcess: ChildProcessWithoutNullStreams

// use ffmpeg to start recording
export async function useRecord(win: BrowserWindow) {
  // console.log(win)
  const platform = getPlatform()

  ipcMain.handle('start', async () => {
    console.log('start')
    win.show()

    // const filename = `${new Date().getTime()}.mp4`
    // const ffmpeg_command = ''

    if (platform === 'mac') {
      // ffmpeg_command = `
      //   ffmpeg -f avfoundation \
      //   -capture_cursor 1 \
      //   -i "1" \
      //   -c:v libx264 \
      //   -r 30 \
      //   -preset ultrafast ~/desktop/${filename}
      // `
    }
    if (platform === 'win') {
      // todo windows
    }

    // const child = spawn(ffmpeg_command, { shell: true })
    // child.stdout.on('data', data => console.log(`stdout: ${data}`))
    // child.stderr.on('data', data => console.error(`stderr: ${data}`))
    // child.on('close', code => console.log(`child process exited with code ${code}`))
    //
    // recorderProcess = child
  })

  ipcMain.handle('stop', () => {
    console.log(kill)
    // kill(recorderProcess.pid, 'SIGINT', (err) => {
    //   if (err)
    //     console.log(err)
    //   else
    //     console.log('recorder process killed')
    // })
  })

  ipcMain.handle('destroy', () => {
    // 隐藏窗口
    win.hide()
  })
}

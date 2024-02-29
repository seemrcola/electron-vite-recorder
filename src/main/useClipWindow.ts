import { dirname, join } from 'node:path'
import * as process from 'node:process'
import { fileURLToPath } from 'node:url'
import { BrowserWindow, screen } from 'electron'
import { getPlatform } from './utils'

const platform = getPlatform()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs    > Preload-Scripts
// ├─┬ dist
// │ └── interface.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

const preload = join(__dirname, '../preload/index.mjs')
const url = process.env.VITE_DEV_SERVER_URL
const clipHtml = join(process.env.DIST, 'clip.html')

function getSize() {
  const { size, scaleFactor } = screen.getPrimaryDisplay()
  return [size.width * scaleFactor, size.height * scaleFactor]
}

export async function useClipWindow() {
  const [width, height] = getSize()

  const childWindow = new BrowserWindow({
    width,
    height,
    title: 'FFMPEG Recorder',
    show: false,
    movable: false,
    frame: false,
    resizable: false,
    fullscreen: platform === 'win',
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload,
    },
  })

  // 设置窗口在所有工作区都可见
  childWindow.setVisibleOnAllWorkspaces(true)
  // 最上层
  childWindow.setAlwaysOnTop(false, 'screen-saver')

  if (process.env.VITE_DEV_SERVER_URL) {
    await childWindow.loadURL(`${url}clip.html`)
    childWindow.webContents.openDevTools({ mode: 'detach' })
  }
  else {
    await childWindow.loadFile(clipHtml)
  }

  return childWindow
}

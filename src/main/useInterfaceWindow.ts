import { dirname, join } from 'node:path'
import * as process from 'node:process'
import { fileURLToPath } from 'node:url'
import { BrowserWindow, screen } from 'electron'

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
const clipHtml = join(process.env.DIST, 'interface.html')

function getSize() {
  const { size, scaleFactor } = screen.getPrimaryDisplay()
  return [size.width * scaleFactor, size.height * scaleFactor]
}

export async function useInterfaceWindow() {
  const [width, height] = getSize()

  const childWindow = new BrowserWindow({
    width: width * 0.8,
    height: height * 0.7,
    alwaysOnTop: true,
    title: 'Recorder Interface',
    webPreferences: {
      preload,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    await childWindow.loadURL(`${url}interface.html`)
    childWindow.webContents.openDevTools()
  }
  else {
    await childWindow.loadFile(clipHtml)
  }

  return childWindow
}
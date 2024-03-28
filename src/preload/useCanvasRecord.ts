import { contextBridge, ipcRenderer } from 'electron'

export function useCanvasRecord() {
  const api = {
    'start': () => {
      return ipcRenderer.invoke('canvas:start')
    },
    'startRecord': (recordOptions: RecordOptions) => {
      return ipcRenderer.invoke('canvas:startRecord', recordOptions)
    },
    'stop': () => {
      return ipcRenderer.invoke('canvas:stop')
    },
    'hide': () => {
      return ipcRenderer.invoke('canvas:hide')
    },
  }

  contextBridge.exposeInMainWorld('useCanvasRecord', api)
}

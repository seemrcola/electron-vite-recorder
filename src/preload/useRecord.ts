import { contextBridge, ipcRenderer } from 'electron'

export function useRecord() {
  const api = {
    start: async () => {
      try {
        await ipcRenderer.invoke('start')
        // 如果没有错误 就回传一个 ok
        return [null, 'ok']
      }
      catch (err) {
        return [err, null]
      }
    },
    stop: async () => {
      await ipcRenderer.invoke('stop')
    },
    destroy: async () => {
      await ipcRenderer.invoke('destroy')
    },
  }

  contextBridge.exposeInMainWorld('useRecord', api)
}

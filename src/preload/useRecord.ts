import { contextBridge, ipcRenderer } from 'electron'

export function useRecord() {
  const api = {
    start: () => {
      return ipcRenderer.invoke('start')
    },
    startRecord: () => {
      return ipcRenderer.invoke('startRecord')
    },
    stop: () => {
      return ipcRenderer.invoke('stop')
    },
    hide: () => {
      return ipcRenderer.invoke('hide')
    },
    message: ({ type, msg }: { type: string, msg: any }) => {
      console.log('准备发送消息')
      ipcRenderer.send('message', { type, msg })
    },
    onChangeIcon: (cb: (msg: any) => void) => {
      ipcRenderer.on('changeIcon', (event, msg) => {
        cb(msg)
      })
    },
  }

  contextBridge.exposeInMainWorld('useRecord', api)
}

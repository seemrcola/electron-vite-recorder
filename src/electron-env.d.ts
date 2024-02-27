/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    VSCODE_DEBUG?: 'true'
    DIST_ELECTRON: string
    DIST: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

interface Window {
  versions: {
    node: () => string
    chrome: () => string
    electron: () => string
  }
  // expose in the `electron/preload/useDrag.ts`
  useDrag: {
    drag: (opt: { x: number, y: number }) => void
  }
  // expose in the `electron/preload/useRecord.ts`
  useRecord: {
    start: () => Promise<any>
    startRecord: () => Promise<any>
    stop: () => Promise<any>
    hide: () => Promise<any>
    message: ({ type: string, msg: any }) => Promise<void>
    transparentClipWin: () => Promise<any>
    onChangeIcon: (cb: (msg: any) => void) => void
  }
}

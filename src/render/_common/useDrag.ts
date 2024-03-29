/**
 * @param cb 回调函数
 * @param queue 回调函数队列
 * @description
 * 优化性能，防止频繁触发
 */
function rafDebounce(cb: () => void, queue: any[]) {
  queue.push(cb)
  requestAnimationFrame(() => {
    if (queue.length !== 0) {
      const lastCallback = queue.pop()
      lastCallback && lastCallback()
      queue.length = 0
    }
  })
}

interface DragLifecycles {
  afterDrag: ({x, y}: { x: number; y: number }) => void
}

export function useDrag(options: DragLifecycles) {
  let startDragging = false
  let dragCoords = { x: 0, y: 0 }
  let deltaCoords = { x: 0, y: 0 }
  const queue: any[] = []

  const { afterDrag } = options

  function run() {
    window.addEventListener('mousedown', start)
  }

  function start(e: MouseEvent) {
    startDragging = true
    const { screenX, screenY } = e
    dragCoords = { x: screenX, y: screenY }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', end)
  }

  function move(e: MouseEvent) {
    if (!startDragging)
      return

    const task = () => {
      const { screenX, screenY } = e
      const dx = screenX - dragCoords.x
      const dy = screenY - dragCoords.y
      deltaCoords = { x: dx, y: dy }
      dragCoords = { x: screenX, y: screenY }
      use()
    }

    rafDebounce(task, queue)
  }

  function end() {
    startDragging = false
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', end)
  }

  // send drag event to preload
  function use() {
    const { x, y } = deltaCoords
    // window.useDrag.drag({ x, y })
    afterDrag({ x, y })
  }

  return { run }
}

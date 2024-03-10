import { onUnmounted, ref } from 'vue'

interface Options {
  border: number
}

export function useXDrag(dom: HTMLElement, options: Options) {
  const lock = ref(false)
  const startX = ref(0)

  function start() {
    dom.addEventListener('mousedown', onmousedown)
  }

  function onmousedown(e: MouseEvent) {
    lock.value = true
    startX.value = e.clientX

    document.addEventListener('mousemove', onmousemove)
    document.addEventListener('mouseup', onmouseup)
  }

  function onmousemove(e: MouseEvent) {
    if (lock.value) {
      // 计算移动的距离
      const distance = e.clientX - startX.value
      // 获取之前的位置
      const left = Number.parseInt(dom.style.left || '0')
      // 设置新的位置
      let newX = left + distance
      if (newX < 0)
        newX = 0
      if (newX > options.border)
        newX = options.border
      dom.style.left = `${newX}px`
      // 更新起始位置
      startX.value = e.clientX
    }
  }

  function onmouseup() {
    lock.value = false
    document.removeEventListener('mousemove', onmousemove)
    document.removeEventListener('mouseup', onmouseup)
  }

  function destroy() {
    dom.removeEventListener('mousedown', onmousedown)
  }

  onUnmounted(() => {
    destroy()
  })

  start()

  return {
    lock,
    start,
    destroy,
    x: startX,
  }
}

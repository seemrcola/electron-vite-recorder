import { onUnmounted, ref } from 'vue'

export function useXDrag(dom: HTMLElement) {
  let lock = false
  const startX = ref(0)

  function start() {
    dom.addEventListener('mousedown', onmousedown)
  }

  function onmousedown(e: MouseEvent) {
    lock = true
    startX.value = e.clientX

    document.addEventListener('mousemove', onmousemove)
    document.addEventListener('mouseup', onmouseup)
  }

  function onmousemove(e: MouseEvent) {
    if (lock) {
      // 计算移动的距离
      const distance = e.clientX - startX.value
      // 获取之前的位置
      const left = Number.parseInt(dom.style.left || '0')
      // 设置新的位置
      dom.style.left = `${left + distance}px`
      // 更新起始位置
      startX.value = e.clientX
    }
  }

  function onmouseup() {
    lock = false
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
    start,
    destroy,
    x: startX,
  }
}

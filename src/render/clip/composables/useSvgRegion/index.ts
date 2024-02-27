import type { App } from 'vue'
import { createApp, ref } from 'vue'
import useRecordTipTemp from './useRecordTipTemp.vue'
import useSvgRegionTemp from './useSvgRegionTemp.vue'

export function useSvgRegion() {
  let svg: SVGSVGElement // svg 获取到这个名称是useSvgRegionTemp中的svg-mask
  let drag: SVGRectElement // drag-rect 用于拖拽
  let hole: SVGRectElement // svg mask 挖出来的洞
  let tip: HTMLElement // resize的提示
  let recordBox: App<Element> // 录制的提示盒子 即recordTipTemp.vue组件createApp的返回值
  let recordBoxDom: HTMLElement // 录制的提示盒子的dom

  let __start = false
  let __start_drag = false
  let __drag_mode: 'move' | 'resize' = 'move'
  let startPoint = { x: 0, y: 0 }
  let startDragPoint = { x: 0, y: 0 }

  async function escCallback(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      // 隐藏
      await window.useRecord.hide()
    }
  }

  function start() {
    createFullScreenSvg()
    svg = document.querySelector('#mask-svg') as SVGSVGElement // 这个名称是useSvgRegionTemp.vue中定义的 算是写死的
    document.addEventListener('mousedown', startRegion)

    document.addEventListener('keydown', escCallback)
  }

  function startRegion(e: MouseEvent) {
    __start = true
    // 如果已经有mask-rect 那么不能再次绘制
    if (document.querySelector('#mask-rect'))
      return

    const { clientX, clientY } = e
    startPoint = {
      x: clientX,
      y: clientY,
    }

    document.addEventListener('mousemove', moveRegion)
    document.addEventListener('mouseup', endRegion)
  }

  function moveRegion(e: MouseEvent) {
    if (!__start)
      return

    const { clientX, clientY } = e

    drawRegion({
      startX: startPoint.x,
      startY: startPoint.y,
      endX: clientX,
      endY: clientY,
    })
  }

  function endRegion() {
    __start = false
    document.removeEventListener('mousemove', moveRegion)
    document.removeEventListener('mouseup', endRegion)

    // 给mask-rect添加监听
    drag = svg.querySelector('#drag-rect') as SVGRectElement
    drag.addEventListener('mousedown', rectMouseDown)
  }

  function rectMouseDown(e: MouseEvent) {
    __start_drag = true
    drag.style.cursor = 'pointer'

    const { clientX, clientY } = e
    startDragPoint = {
      x: clientX,
      y: clientY,
    }
    document.addEventListener('mousemove', rectMouseMove)
    document.addEventListener('mouseup', rectMouseUp)

    // 当鼠标不在定点附近的时候视为move
    const { x, y, width, height } = hole.getBBox()
    // 计算出鼠标到矩形右下角的距离
    const dist = Math.sqrt((x + width - clientX) ** 2 + (y + height - clientY) ** 2) // 右下角
    if (dist > 10)
      __drag_mode = 'move'
    else
      __drag_mode = 'resize'
  }

  function rectMouseMove(e: MouseEvent) {
    if (!__start_drag)
      return

    const { clientX, clientY } = e
    const dx = clientX - startDragPoint.x
    const dy = clientY - startDragPoint.y

    if (__drag_mode === 'move') {
      drag.setAttribute('x', `${Number(drag.getAttribute('x')) + dx}`)
      drag.setAttribute('y', `${Number(drag.getAttribute('y')) + dy}`)
      hole.setAttribute('x', `${Number(hole.getAttribute('x')) + dx}`)
      hole.setAttribute('y', `${Number(hole.getAttribute('y')) + dy}`)
    }
    if (__drag_mode === 'resize') {
      // 小于0的时候不变
      if (Number(hole.getAttribute('width')) + dx < 0 || Number(hole.getAttribute('height')) + dy < 0)
        return
      hole.setAttribute('width', `${Number(hole.getAttribute('width')) + dx}`)
      hole.setAttribute('height', `${Number(hole.getAttribute('height')) + dy}`)
      drag.setAttribute('width', `${Number(drag.getAttribute('width')) + dx}`)
      drag.setAttribute('height', `${Number(drag.getAttribute('height')) + dy}`)
    }

    startDragPoint = {
      x: clientX,
      y: clientY,
    }

    resizeTip()
    recordTip()
  }

  function rectMouseUp() {
    __start_drag = false
    drag.style.cursor = 'default'
    document.removeEventListener('mousemove', rectMouseMove)
    document.removeEventListener('mouseup', rectMouseUp)
  }

  function createFullScreenSvg() {
    const app = createApp(useSvgRegionTemp)
    const fragment = document.createDocumentFragment()
    app.mount(fragment as unknown as HTMLElement)
    document.body.appendChild(fragment)
  }

  function drawRegion({ startX, startY, endX, endY }: { startX: number, startY: number, endX: number, endY: number }) {
    if (!svg)
      return

    const width = Math.abs(endX - startX)
    const height = Math.abs(endY - startY)
    const left = Math.min(startX, endX)
    const top = Math.min(startY, endY)

    // 获取mask
    const mask = svg.querySelector('#mask') as SVGMaskElement
    // 清除掉mask的内容 重新绘制
    if (mask.children.length > 1) {
      for (let i = 1; i < mask.children.length; i++)
        mask.removeChild(mask.children[i])
    }
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.id = 'mask-rect'
    rect.setAttribute('x', `${left}`)
    rect.setAttribute('y', `${top}`)
    rect.setAttribute('width', `${width}`)
    rect.setAttribute('height', `${height}`)
    rect.setAttribute('fill', 'black')
    mask.appendChild(rect)
    hole = rect // 保存hole

    // 由于这个rect是不能做任何交互的 所以为了交互我们要再加一个rect去做交互
    // 清除掉drag-rect的内容 重新绘制
    if (svg.querySelector('#drag-rect'))
      svg.removeChild(svg.querySelector('#drag-rect')!)
    const dragRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    dragRect.id = 'drag-rect'
    dragRect.setAttribute('x', `${left}`)
    dragRect.setAttribute('y', `${top}`)
    dragRect.setAttribute('width', `${width}`)
    dragRect.setAttribute('height', `${height}`)
    dragRect.setAttribute('fill', 'transparent')
    // 加个虚线边框
    dragRect.setAttribute('stroke', 'orange')
    dragRect.setAttribute('stroke-width', '2')
    dragRect.setAttribute('stroke-dasharray', '5 5')

    svg.appendChild(dragRect)

    resizeTip()
    recordTip()
  }

  // 在drag-rect的右下角加一个resize标识
  function resizeTip() {
    tip?.remove()
    tip = document.createElement('div')
    tip.style.cssText = `
      transform: translate(0, 0);
      position: absolute;
      width: 150px;
      height:20px;
      right: 0;
      bottom: 0;
      padding: 2px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: red;
      cursor: pointer;
      z-index: 9999;
      font-size: 12px;
      background-color: rgb(29, 29, 29);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
      border-radius: 4px;
      color: #fff;
    `
    tip.textContent = '⬇️ 可拖拽该点改变大小'
    // 找到drag的位置
    const { x, y, width, height } = hole.getBBox()
    tip.style.left = `${x + width}px`
    tip.style.top = `${y + height}px`
    document.body.appendChild(tip)
  }

  function recordTip() {
    if (recordBox) {
      recordBox.unmount()
      recordBoxDom?.remove()
    }

    const currentRecorderType = ref<'window' | 'select'>('window')
    recordBox = createApp(useRecordTipTemp, {
      currentRecorderType,
      startRecord: () => {
        window.useRecord.startRecord()
          .then(() => {
            // 首先根据全屏录制还是区域录制来判断是否需要隐藏窗口
            if (currentRecorderType.value === 'window') {
              window.useRecord.hide()
            }
            else {
              // 需要删掉各种提示框
              tip?.remove()
              recordBoxDom?.remove()
              // 去掉esc按钮的监听
              document.removeEventListener('keydown', escCallback)
              // 告诉窗口让它变成可穿透窗口
              window.useRecord.transparentClipWin()
            }
            // 其次需要通知index入口的页面来进行图标的改变
            window.useRecord.message({ type: 'change-icon', msg: 'recording' })
          })
          .catch(err => console.error(err))
      },
    })
    recordBoxDom = document.createElement('div')
    recordBox.mount(recordBoxDom)

    const holeRect = hole.getBBox()

    recordBoxDom.style.cssText = `
      position: fixed;
      top: ${holeRect.y + holeRect.height + 10}px;
      left: ${holeRect.x + holeRect.width / 2}px;
      transform: translate(-50%, 0);
      z-index: 9999;
      background-color: rgb(29, 29, 29);
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
      border-radius: 4px;
      color: #fff;
    `
    document.body.appendChild(recordBoxDom)
  }

  return {
    start,
  }
}

import { onBeforeUnmount } from 'vue'

export type Placement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end'

/**
 * 计算浮层相对触发元素的固定定位坐标（viewport 坐标，配合 position: fixed 使用）。
 * 纯手写实现：按 placement 计算主轴 + 对齐轴，并做简单的视口边界收敛。
 */
export function computePosition(
  reference: HTMLElement,
  floating: HTMLElement,
  placement: Placement = 'bottom',
  offset = 6,
): { top: number; left: number } {
  const r = reference.getBoundingClientRect()
  const f = floating.getBoundingClientRect()
  const [side, align] = placement.split('-') as [string, string | undefined]

  let top = 0
  let left = 0

  switch (side) {
    case 'top':
      top = r.top - f.height - offset
      break
    case 'bottom':
      top = r.bottom + offset
      break
    case 'left':
      left = r.left - f.width - offset
      break
    case 'right':
      left = r.right + offset
      break
  }

  if (side === 'top' || side === 'bottom') {
    if (align === 'start') left = r.left
    else if (align === 'end') left = r.right - f.width
    else left = r.left + r.width / 2 - f.width / 2
  } else {
    if (align === 'start') top = r.top
    else if (align === 'end') top = r.bottom - f.height
    else top = r.top + r.height / 2 - f.height / 2
  }

  // 简单的视口边界收敛，避免浮层溢出屏幕
  const margin = 4
  left = Math.max(margin, Math.min(left, window.innerWidth - f.width - margin))
  top = Math.max(margin, Math.min(top, window.innerHeight - f.height - margin))

  return { top, left }
}

/**
 * 点击浮层与触发元素之外时触发回调。使用捕获阶段的 mousedown，
 * 保证在触发元素自身的 click 之前完成命中判断。
 */
export function useClickOutside(
  getEls: () => (HTMLElement | null | undefined)[],
  handler: () => void,
) {
  const listener = (e: MouseEvent) => {
    const target = e.target as Node
    const inside = getEls().some((el) => el && el.contains(target))
    if (!inside) handler()
  }
  document.addEventListener('mousedown', listener, true)
  onBeforeUnmount(() => document.removeEventListener('mousedown', listener, true))
}

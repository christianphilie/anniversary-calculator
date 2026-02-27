import { CONFIG } from '../types'

const MOBILE_BREAKPOINT = '(max-width: 768px)'
const STICKY_STACK_SELECTOR = '.year-navigation-sticky'
const STICKY_PADDING = 8
const SCROLL_MARGIN_RESET_DELAY_MS = 200

export function getStickyHeaderOffset(): number {
  const styles = getComputedStyle(document.documentElement)
  const isMobile = window.matchMedia(MOBILE_BREAKPOINT).matches
  const baseOffset = isMobile
    ? parseFloat(styles.getPropertyValue('--sticky-header-height-mobile')) || CONFIG.STICKY_HEADER_OFFSET_MOBILE
    : parseFloat(styles.getPropertyValue('--sticky-header-height-desktop')) || CONFIG.STICKY_HEADER_OFFSET_DESKTOP
  const stickyStackHeight = document.querySelector<HTMLElement>(STICKY_STACK_SELECTOR)?.offsetHeight || 0
  return baseOffset + stickyStackHeight + STICKY_PADDING
}

export function scrollElementBelowStickyHeaders(
  element: HTMLElement,
  behavior: ScrollBehavior = 'smooth'
): void {
  const originalScrollMarginTop = element.style.scrollMarginTop
  element.style.scrollMarginTop = `${getStickyHeaderOffset()}px`

  requestAnimationFrame(() => {
    element.scrollIntoView({ behavior, block: 'start' })
    setTimeout(() => {
      element.style.scrollMarginTop = originalScrollMarginTop
    }, SCROLL_MARGIN_RESET_DELAY_MS)
  })
}

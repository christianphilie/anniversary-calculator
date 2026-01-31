<template>
  <div class="year-navigation-wrapper">
    <button
      v-if="canScrollLeft"
      class="year-nav-scroll-btn year-nav-scroll-left"
      type="button"
      @click="scrollLeft"
      :aria-label="t('form.scrollLeft')"
      :title="t('form.scrollLeft')"
    >
      ←
    </button>
    <div class="year-navigation-container">
      <div class="year-navigation-scroll" ref="scrollRef">
        <div class="year-navigation-list">
          <span
            v-for="year in availableYears"
            :key="year"
            :class="['year-nav-item', { 'year-nav-item-active': currentVisibleYear === year }]"
            @click="jumpToYear(year)"
            :aria-label="`${t('form.jumpToYear')}: ${year}`"
            :title="year.toString()"
          >
            {{ year }}
          </span>
        </div>
      </div>
      <Transition name="fade">
        <div 
          v-if="canScrollLeft" 
          class="year-navigation-fade year-navigation-fade-left"
        ></div>
      </Transition>
      <Transition name="fade">
        <div 
          v-if="canScrollRight" 
          class="year-navigation-fade year-navigation-fade-right"
        ></div>
      </Transition>
    </div>
    <button
      v-if="canScrollRight"
      class="year-nav-scroll-btn year-nav-scroll-right"
      type="button"
      @click="scrollRight"
      :aria-label="t('form.scrollRight')"
      :title="t('form.scrollRight')"
    >
      →
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useI18n } from '../i18n'
import { useAppState } from '../composables/useAppState'

const { t } = useI18n()
const { state } = useAppState()

const scrollRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const currentVisibleYear = ref<number | null>(null)

const availableYears = computed(() => {
  const years = new Set<number>()
  state.value.eventsView.forEach(ev => {
    years.add(ev.date.getFullYear())
  })
  return Array.from(years).sort((a, b) => a - b)
})

function checkScrollState(): void {
  if (!scrollRef.value) return
  
  const scroll = scrollRef.value
  canScrollLeft.value = scroll.scrollLeft > 1
  canScrollRight.value = scroll.scrollLeft < scroll.scrollWidth - scroll.clientWidth - 1
}

function updateVisibleYear(): void {
  const isMobile = window.innerWidth <= 768
  const headerOffset = isMobile ? 92 : 192
  
  // Find the year separator that is currently visible in the viewport
  let visibleYear: number | null = null
  let minDistance = Infinity
  
  for (const year of availableYears.value) {
    const element = document.getElementById(`y-${year}`)
    if (!element) continue
    
    const rect = element.getBoundingClientRect()
    const distanceFromTop = rect.top - headerOffset
    
    // Check if the separator is in the viewport (with some tolerance)
    if (rect.top <= headerOffset + 50 && rect.bottom >= headerOffset) {
      // This separator is visible, use it
      visibleYear = year
      break
    }
    
    // Track the closest separator above the viewport
    if (distanceFromTop < 0 && Math.abs(distanceFromTop) < minDistance) {
      minDistance = Math.abs(distanceFromTop)
      visibleYear = year
    }
  }
  
  // If the visible year changed, scroll the navigation to center it
  if (visibleYear !== null && visibleYear !== currentVisibleYear.value) {
    scrollToYearInNavigation(visibleYear)
  }
  
  currentVisibleYear.value = visibleYear
}

function scrollToYearInNavigation(year: number): void {
  if (!scrollRef.value) return
  
  const yearItems = scrollRef.value.querySelectorAll('.year-nav-item')
  for (const item of yearItems) {
    if (item.textContent === year.toString()) {
      const containerRect = scrollRef.value.getBoundingClientRect()
      const itemRect = item.getBoundingClientRect()
      const containerWidth = containerRect.width
      const itemWidth = itemRect.width
      const itemOffsetLeft = (item as HTMLElement).offsetLeft
      
      // Calculate the scroll position to center the item
      const scrollLeft = itemOffsetLeft - (containerWidth / 2) + (itemWidth / 2)
      
      // Check if we can actually center it (not at the start or end)
      const maxScrollLeft = scrollRef.value.scrollWidth - containerWidth
      const canCenterLeft = scrollLeft >= 0
      const canCenterRight = scrollLeft <= maxScrollLeft
      
      // Only scroll if we can center it, otherwise scroll as far as possible
      if (canCenterLeft && canCenterRight) {
        scrollRef.value.scrollTo({ left: scrollLeft, behavior: 'smooth' })
      } else if (!canCenterLeft) {
        // At the start, scroll to beginning
        scrollRef.value.scrollTo({ left: 0, behavior: 'smooth' })
      } else if (!canCenterRight) {
        // At the end, scroll to end
        scrollRef.value.scrollTo({ left: maxScrollLeft, behavior: 'smooth' })
      }
      
      break
    }
  }
}

function scrollLeft(): void {
  if (!scrollRef.value) return
  scrollRef.value.scrollBy({ left: -200, behavior: 'smooth' })
}

function scrollRight(): void {
  if (!scrollRef.value) return
  scrollRef.value.scrollBy({ left: 200, behavior: 'smooth' })
}

function jumpToYear(year: number): void {
  // Wait for next tick to ensure DOM is ready
  nextTick(() => {
    const element = document.getElementById(`y-${year}`)
    if (!element) {
      console.warn(`Year separator not found: y-${year}`)
      return
    }
    
    // Calculate total height of sticky elements:
    // - App Header (sticky at top:0): ~100px
    // - Panel Header (sticky at top:100px): 52px
    // - Year Navigation (sticky at top:152px): 40px
    // Total: 192px on desktop, 92px on mobile (header not sticky)
    const isMobile = window.innerWidth <= 768
    const headerOffset = isMobile ? 92 : 192
    
    // Use scrollIntoView with block: 'start' and then adjust for header offset
    // Temporarily set scroll-margin-top to account for sticky headers
    const originalScrollMarginTop = (element as HTMLElement).style.scrollMarginTop
    ;(element as HTMLElement).style.scrollMarginTop = `${headerOffset}px`
    
    // Use requestAnimationFrame to ensure scroll-margin-top is applied before scrollIntoView
    requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      
      // Restore original scroll-margin-top after scroll starts
      setTimeout(() => {
        ;(element as HTMLElement).style.scrollMarginTop = originalScrollMarginTop
      }, 200)
    })
    
    // Update visible year after scroll completes
    setTimeout(() => {
      updateVisibleYear()
    }, 300)
    
    // Scroll the year navigation horizontally to show the selected year
    if (scrollRef.value) {
      nextTick(() => {
        const yearItems = scrollRef.value?.querySelectorAll('.year-nav-item')
        if (yearItems) {
          for (const item of yearItems) {
            if (item.textContent === year.toString()) {
              const containerRect = scrollRef.value!.getBoundingClientRect()
              const itemRect = item.getBoundingClientRect()
              const scrollLeft = (item as HTMLElement).offsetLeft - containerRect.width / 2 + itemRect.width / 2
              scrollRef.value!.scrollTo({ left: scrollLeft, behavior: 'smooth' })
              break
            }
          }
        }
      })
    }
  })
}

onMounted(() => {
  if (scrollRef.value) {
    scrollRef.value.addEventListener('scroll', checkScrollState)
    window.addEventListener('resize', checkScrollState)
    window.addEventListener('scroll', updateVisibleYear, { passive: true })
    checkScrollState()
    updateVisibleYear()
  }
  
  watch(() => availableYears.value.length, () => {
    nextTick(() => {
      checkScrollState()
      updateVisibleYear()
    })
  }, { immediate: true })
  
  watch(() => state.value.eventsView.length, () => {
    nextTick(() => {
      checkScrollState()
      updateVisibleYear()
    })
  })
})

onUnmounted(() => {
  if (scrollRef.value) {
    scrollRef.value.removeEventListener('scroll', checkScrollState)
  }
  window.removeEventListener('resize', checkScrollState)
  window.removeEventListener('scroll', updateVisibleYear)
})
</script>

<style scoped>
.year-navigation-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: var(--panel);
  border-bottom: 1px solid var(--border);
  height: 40px;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  position: relative;
}

.year-navigation-container {
  position: relative;
  flex: 1;
  min-width: 0;
  width: 100%;
  max-width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.year-navigation-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  max-width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  min-width: 0;
  contain: strict;
}

.year-navigation-scroll::-webkit-scrollbar {
  display: none;
}

.year-navigation-list {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  padding: 0;
  margin: 0;
  height: 100%;
  min-width: max-content;
  flex-shrink: 0;
  max-width: 100vw;
}

.year-nav-item {
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
  flex-shrink: 0;
  padding: 0;
  margin: 0;
  line-height: 20px;
  display: inline-block;
  vertical-align: middle;
  user-select: none;
  -webkit-user-select: none;
}

.year-nav-item:hover {
  color: var(--text);
}

.year-nav-item-active {
  color: var(--text);
  font-weight: 700;
}

.year-navigation-fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  pointer-events: none;
  z-index: 1;
}

.year-navigation-fade-left {
  left: 0;
  background: linear-gradient(to right, var(--panel) 0%, var(--panel) 50%, transparent 100%);
}

.year-navigation-fade-right {
  right: 0;
  background: linear-gradient(to left, var(--panel) 0%, var(--panel) 50%, transparent 100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.year-nav-scroll-btn {
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--muted);
  border-radius: var(--radius);
  padding: 0;
  font-size: 16px;
  cursor: pointer;
  transition: var(--transition);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 20px;
  line-height: 1;
}

.year-nav-scroll-btn:hover {
  background: var(--panel);
  border-color: var(--brand);
  color: var(--text);
}

.year-nav-scroll-btn:focus-visible {
  outline: none;
  box-shadow: var(--focus);
}

/* Show scroll buttons only on devices that don't support horizontal scrolling well */
/* Hide by default (desktop with mouse can scroll horizontally) */
.year-nav-scroll-btn {
  display: none;
}

/* Show on touch devices where horizontal scrolling might not be intuitive */
@media (hover: none) and (pointer: coarse) {
  .year-nav-scroll-btn {
    display: flex;
  }
}

</style>

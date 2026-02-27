<template>
  <div class="flex items-center gap-2 bg-transparent px-4 py-2">
    <Button
      v-if="shouldShowButtons && canScrollLeft"
      variant="ghost"
      size="icon"
      class="h-7 w-7 shrink-0 text-muted-foreground/80 hover:text-foreground"
      @click="scrollLeft"
      :aria-label="t('form.scrollLeft')"
      :title="t('form.scrollLeft')"
    >
      <ChevronLeft class="h-3.5 w-3.5" aria-hidden="true" />
    </Button>
    <div class="relative flex min-w-0 flex-1 items-center overflow-hidden">
      <div
        class="year-navigation-scroll w-full min-w-0 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none]"
        ref="scrollRef"
      >
        <div class="inline-flex min-w-max items-center gap-1">
          <button
            v-for="year in availableYears"
            :key="year"
            type="button"
            :class="cn(
              'year-nav-item inline-flex h-7 min-w-9 shrink-0 items-center justify-center rounded-md border px-2 text-xs font-medium transition-colors',
              currentVisibleYear === year
                ? 'border-border bg-secondary text-secondary-foreground shadow-sm'
                : 'border-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )"
            @click="jumpToYear(year)"
            :aria-label="`${t('form.jumpToYear')}: ${year}`"
            :title="year.toString()"
          >
            {{ year }}
          </button>
        </div>
      </div>
      <div
        v-if="hasOverflow && canScrollLeft"
        class="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-card to-transparent"
      />
      <div
        v-if="hasOverflow && canScrollRight"
        class="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-card to-transparent"
      />
    </div>
    <Button
      v-if="shouldShowButtons && canScrollRight"
      variant="ghost"
      size="icon"
      class="h-7 w-7 shrink-0 text-muted-foreground/80 hover:text-foreground"
      @click="scrollRight"
      :aria-label="t('form.scrollRight')"
      :title="t('form.scrollRight')"
    >
      <ChevronRight class="h-3.5 w-3.5" aria-hidden="true" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useI18n } from '../i18n'
import { useAppState } from '../composables/useAppState'
import { getStickyHeaderOffset, scrollElementBelowStickyHeaders } from '../utils/sticky'

const { t } = useI18n()
const { state } = useAppState()

const scrollRef = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const hasOverflow = ref(false)
const shouldShowButtons = ref(false)
const currentVisibleYear = ref<number | null>(null)
const supportsSwipe = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0

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
  const maxScrollLeft = scroll.scrollWidth - scroll.clientWidth
  hasOverflow.value = maxScrollLeft > 1
  canScrollLeft.value = scroll.scrollLeft > 1
  canScrollRight.value = scroll.scrollLeft < maxScrollLeft - 1
  shouldShowButtons.value = hasOverflow.value && !supportsSwipe
}

function updateVisibleYear(): void {
  const headerOffset = getStickyHeaderOffset()
  
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

  if (visibleYear === null && availableYears.value.length > 0) {
    visibleYear = availableYears.value[0]
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
    const element = document.getElementById(`y-${year}`) as HTMLElement | null
    if (!element) {
      console.warn(`Year separator not found: y-${year}`)
      return
    }
    scrollElementBelowStickyHeaders(element)
    
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
  }

  window.addEventListener('resize', checkScrollState)
  window.addEventListener('scroll', updateVisibleYear, { passive: true })
  checkScrollState()
  updateVisibleYear()
  
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
.year-navigation-scroll::-webkit-scrollbar {
  display: none;
}
</style>

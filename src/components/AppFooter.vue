<template>
  <footer class="mt-1 border-t border-border pt-3">
    <div class="flex flex-col items-center gap-1 text-center text-xs leading-relaxed text-muted-foreground">
      <p class="m-0 inline-flex items-center gap-1">
        <span>Made with</span>
        <Heart class="h-3.5 w-3.5 text-red-500 align-middle" aria-hidden="true" />
        <span>by</span>
        <a
          href="https://github.com/christianphilie"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 font-medium text-foreground underline decoration-transparent underline-offset-2 transition hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          <Github class="h-3.5 w-3.5 align-middle" aria-hidden="true" />
          <span class="align-middle">christianphilie</span>
        </a>
      </p>
      <p class="m-0">
        <a
          href="https://www.buymeacoffee.com/christianphilie"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 font-medium text-muted-foreground underline decoration-transparent underline-offset-2 transition hover:text-foreground hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          <Coffee class="h-3.5 w-3.5" aria-hidden="true" /> Buy me a coffee
        </a>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Coffee, Github, Heart } from 'lucide-vue-next'
</script>

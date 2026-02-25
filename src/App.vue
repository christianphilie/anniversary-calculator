<template>
  <ErrorBoundary>
    <div class="wrap app-shell">
      <a href="#main-content" class="skip-link">Zum Hauptinhalt springen</a>
      <AppHeader />
      <main id="main-content" class="app-grid">
        <div class="left-column">
          <Card class="sidebar-tabs-shell" aria-label="Konfiguration und Export">
            <CardContent class="p-3">
              <Tabs v-model="activeSidebarTab" class="sidebar-tabs">
                <TabsList class="sidebar-tabs-list">
                  <TabsTrigger value="inputs">{{ t('ui.inputs') }}</TabsTrigger>
                  <TabsTrigger value="export">{{ t('export.title') }}</TabsTrigger>
                </TabsList>
                <TabsContent value="inputs" class="sidebar-tabs-content">
                  <InputPanel />
                </TabsContent>
                <TabsContent value="export" class="sidebar-tabs-content">
                  <ExportPanel />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          <AppFooter class="footer-desktop" />
        </div>
        <div class="results-grid">
          <ResultsPanel />
          <AppFooter class="footer-mobile" />
        </div>
      </main>
      <Toast />
    </div>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { provideError } from './composables/useError'
import { provideAppState } from './composables/useAppState'
import { useI18n } from './i18n'
import ErrorBoundary from './components/ErrorBoundary.vue'
import AppHeader from './components/AppHeader.vue'
import InputPanel from './components/InputPanel.vue'
import ExportPanel from './components/ExportPanel.vue'
import ResultsPanel from './components/ResultsPanel.vue'
import AppFooter from './components/AppFooter.vue'
import Toast from './components/Toast.vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Card, CardContent } from './components/ui/card'

// Provide error state to all components
provideError()

// Provide app state to all components (shared state)
provideAppState()

const { locale, t } = useI18n()
const activeSidebarTab = ref<'inputs' | 'export'>('inputs')

function updateMeta(): void {
  const title = t.value('ui.metaTitle')
  const description = t.value('ui.metaDescription')
  document.title = title

  const ensure = (selector: string, attr: 'content' | 'name' | 'property', value: string) => {
    const el = document.querySelector<HTMLMetaElement>(selector)
    if (el) el.setAttribute(attr, value)
  }

  ensure('meta[name=\"description\"]', 'content', description)
  ensure('meta[property=\"og:title\"]', 'content', title)
  ensure('meta[property=\"og:description\"]', 'content', description)
  ensure('meta[name=\"twitter:title\"]', 'content', title)
  ensure('meta[name=\"twitter:description\"]', 'content', description)
}

onMounted(updateMeta)
watch(locale, updateMeta)
</script>

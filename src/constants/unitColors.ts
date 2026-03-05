import type { Unit } from '../types'

export interface UnitColorClasses {
  surface: string
  textPrimary: string
  textSecondary: string
  checkbox: string
  countBadge: string
  copyButton: string
  favoriteButton: string
  favoriteButtonActive: string
}

export const UNIT_COLOR_CLASSES: Record<Unit, UnitColorClasses> = {
  years: {
    surface: 'bg-linear-to-r from-fuchsia-400/12 via-violet-400/10 to-indigo-400/12 hover:from-fuchsia-400/18 hover:via-violet-400/16 hover:to-indigo-400/18 dark:from-fuchsia-300/28 dark:via-violet-300/20 dark:to-indigo-300/28 dark:hover:from-fuchsia-300/36 dark:hover:via-violet-300/30 dark:hover:to-indigo-300/36',
    textPrimary: 'text-violet-900/90 dark:text-fuchsia-100/95',
    textSecondary: 'text-violet-800/78 dark:text-violet-200/82',
    checkbox: 'border-violet-500/50 data-[state=checked]:border-violet-500 data-[state=checked]:bg-violet-500 data-[state=checked]:text-white',
    countBadge: 'border-violet-500/24 bg-white/58 text-violet-900/88 dark:border-violet-300/30 dark:bg-violet-950/38 dark:text-violet-100/92',
    copyButton: 'text-violet-900/78 hover:bg-white/45 hover:text-violet-900 dark:text-violet-200/82 dark:hover:bg-violet-100/12 dark:hover:text-violet-100',
    favoriteButton: 'text-violet-900/70 hover:bg-white/45 hover:text-violet-900 dark:text-violet-200/75 dark:hover:bg-violet-100/12 dark:hover:text-violet-100',
    favoriteButtonActive: 'bg-white/58 text-violet-900 hover:bg-white/75 dark:bg-violet-100/16 dark:text-violet-100 dark:hover:bg-violet-100/24'
  },
  months: {
    surface: 'bg-linear-to-r from-indigo-400/12 via-blue-400/10 to-cyan-400/12 hover:from-indigo-400/18 hover:via-blue-400/16 hover:to-cyan-400/18 dark:from-indigo-300/28 dark:via-blue-300/20 dark:to-cyan-300/28 dark:hover:from-indigo-300/36 dark:hover:via-blue-300/30 dark:hover:to-cyan-300/36',
    textPrimary: 'text-indigo-900/90 dark:text-indigo-100/95',
    textSecondary: 'text-indigo-800/78 dark:text-indigo-200/82',
    checkbox: 'border-indigo-500/50 data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-500 data-[state=checked]:text-white',
    countBadge: 'border-indigo-500/24 bg-white/58 text-indigo-900/88 dark:border-indigo-300/30 dark:bg-indigo-950/38 dark:text-indigo-100/92',
    copyButton: 'text-indigo-900/78 hover:bg-white/45 hover:text-indigo-900 dark:text-indigo-200/82 dark:hover:bg-indigo-100/12 dark:hover:text-indigo-100',
    favoriteButton: 'text-indigo-900/70 hover:bg-white/45 hover:text-indigo-900 dark:text-indigo-200/75 dark:hover:bg-indigo-100/12 dark:hover:text-indigo-100',
    favoriteButtonActive: 'bg-white/58 text-indigo-900 hover:bg-white/75 dark:bg-indigo-100/16 dark:text-indigo-100 dark:hover:bg-indigo-100/24'
  },
  weeks: {
    surface: 'bg-linear-to-r from-blue-500/15 via-sky-300/9 to-indigo-500/15 hover:from-blue-500/24 hover:via-sky-300/16 hover:to-indigo-500/24 dark:from-blue-300/30 dark:via-sky-300/18 dark:to-indigo-300/30 dark:hover:from-blue-300/40 dark:hover:via-sky-300/28 dark:hover:to-indigo-300/40',
    textPrimary: 'text-blue-900/90 dark:text-blue-100/95',
    textSecondary: 'text-blue-800/78 dark:text-blue-200/82',
    checkbox: 'border-blue-500/50 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white',
    countBadge: 'border-blue-500/24 bg-white/58 text-blue-900/88 dark:border-blue-300/30 dark:bg-blue-950/38 dark:text-blue-100/92',
    copyButton: 'text-blue-900/78 hover:bg-white/45 hover:text-blue-900 dark:text-blue-200/82 dark:hover:bg-blue-100/12 dark:hover:text-blue-100',
    favoriteButton: 'text-blue-900/70 hover:bg-white/45 hover:text-blue-900 dark:text-blue-200/75 dark:hover:bg-blue-100/12 dark:hover:text-blue-100',
    favoriteButtonActive: 'bg-white/58 text-blue-900 hover:bg-white/75 dark:bg-blue-100/16 dark:text-blue-100 dark:hover:bg-blue-100/24'
  },
  days: {
    surface: 'bg-linear-to-r from-sky-500/15 via-cyan-300/9 to-teal-500/15 hover:from-sky-500/24 hover:via-cyan-300/16 hover:to-teal-500/24 dark:from-sky-300/30 dark:via-cyan-300/18 dark:to-teal-300/30 dark:hover:from-sky-300/40 dark:hover:via-cyan-300/28 dark:hover:to-teal-300/40',
    textPrimary: 'text-sky-900/90 dark:text-sky-100/95',
    textSecondary: 'text-sky-800/78 dark:text-sky-200/82',
    checkbox: 'border-sky-500/50 data-[state=checked]:border-sky-500 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white',
    countBadge: 'border-sky-500/24 bg-white/58 text-sky-900/88 dark:border-sky-300/30 dark:bg-sky-950/38 dark:text-sky-100/92',
    copyButton: 'text-sky-900/78 hover:bg-white/45 hover:text-sky-900 dark:text-sky-200/82 dark:hover:bg-sky-100/12 dark:hover:text-sky-100',
    favoriteButton: 'text-sky-900/70 hover:bg-white/45 hover:text-sky-900 dark:text-sky-200/75 dark:hover:bg-sky-100/12 dark:hover:text-sky-100',
    favoriteButtonActive: 'bg-white/58 text-sky-900 hover:bg-white/75 dark:bg-sky-100/16 dark:text-sky-100 dark:hover:bg-sky-100/24'
  },
  hours: {
    surface: 'bg-linear-to-r from-cyan-500/15 via-teal-300/9 to-emerald-500/15 hover:from-cyan-500/24 hover:via-teal-300/16 hover:to-emerald-500/24 dark:from-cyan-300/30 dark:via-teal-300/18 dark:to-emerald-300/30 dark:hover:from-cyan-300/40 dark:hover:via-teal-300/28 dark:hover:to-emerald-300/40',
    textPrimary: 'text-cyan-900/90 dark:text-cyan-100/95',
    textSecondary: 'text-cyan-800/78 dark:text-cyan-200/82',
    checkbox: 'border-cyan-500/50 data-[state=checked]:border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-white',
    countBadge: 'border-cyan-500/24 bg-white/58 text-cyan-900/88 dark:border-cyan-300/30 dark:bg-cyan-950/38 dark:text-cyan-100/92',
    copyButton: 'text-cyan-900/78 hover:bg-white/45 hover:text-cyan-900 dark:text-cyan-200/82 dark:hover:bg-cyan-100/12 dark:hover:text-cyan-100',
    favoriteButton: 'text-cyan-900/70 hover:bg-white/45 hover:text-cyan-900 dark:text-cyan-200/75 dark:hover:bg-cyan-100/12 dark:hover:text-cyan-100',
    favoriteButtonActive: 'bg-white/58 text-cyan-900 hover:bg-white/75 dark:bg-cyan-100/16 dark:text-cyan-100 dark:hover:bg-cyan-100/24'
  },
  minutes: {
    surface: 'bg-linear-to-r from-teal-500/15 via-emerald-300/9 to-green-500/15 hover:from-teal-500/24 hover:via-emerald-300/16 hover:to-green-500/24 dark:from-teal-300/30 dark:via-emerald-300/18 dark:to-green-300/30 dark:hover:from-teal-300/40 dark:hover:via-emerald-300/28 dark:hover:to-green-300/40',
    textPrimary: 'text-teal-900/90 dark:text-teal-100/95',
    textSecondary: 'text-teal-800/78 dark:text-teal-200/82',
    checkbox: 'border-teal-500/50 data-[state=checked]:border-teal-500 data-[state=checked]:bg-teal-500 data-[state=checked]:text-white',
    countBadge: 'border-teal-500/24 bg-white/58 text-teal-900/88 dark:border-teal-300/30 dark:bg-teal-950/38 dark:text-teal-100/92',
    copyButton: 'text-teal-900/78 hover:bg-white/45 hover:text-teal-900 dark:text-teal-200/82 dark:hover:bg-teal-100/12 dark:hover:text-teal-100',
    favoriteButton: 'text-teal-900/70 hover:bg-white/45 hover:text-teal-900 dark:text-teal-200/75 dark:hover:bg-teal-100/12 dark:hover:text-teal-100',
    favoriteButtonActive: 'bg-white/58 text-teal-900 hover:bg-white/75 dark:bg-teal-100/16 dark:text-teal-100 dark:hover:bg-teal-100/24'
  },
  seconds: {
    surface: 'bg-linear-to-r from-emerald-400/12 via-lime-400/10 to-green-400/12 hover:from-emerald-400/18 hover:via-lime-400/16 hover:to-green-400/18 dark:from-emerald-300/28 dark:via-lime-300/20 dark:to-green-300/28 dark:hover:from-emerald-300/36 dark:hover:via-lime-300/30 dark:hover:to-green-300/36',
    textPrimary: 'text-emerald-900/90 dark:text-emerald-100/95',
    textSecondary: 'text-emerald-800/78 dark:text-emerald-200/82',
    checkbox: 'border-emerald-500/50 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white',
    countBadge: 'border-emerald-500/24 bg-white/58 text-emerald-900/88 dark:border-emerald-300/30 dark:bg-emerald-950/38 dark:text-emerald-100/92',
    copyButton: 'text-emerald-900/78 hover:bg-white/45 hover:text-emerald-900 dark:text-emerald-200/82 dark:hover:bg-emerald-100/12 dark:hover:text-emerald-100',
    favoriteButton: 'text-emerald-900/70 hover:bg-white/45 hover:text-emerald-900 dark:text-emerald-200/75 dark:hover:bg-emerald-100/12 dark:hover:text-emerald-100',
    favoriteButtonActive: 'bg-white/58 text-emerald-900 hover:bg-white/75 dark:bg-emerald-100/16 dark:text-emerald-100 dark:hover:bg-emerald-100/24'
  }
}

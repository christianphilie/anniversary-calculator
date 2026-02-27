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
    surface: 'border-red-500/25 bg-red-500/10 hover:bg-red-500/15 dark:border-red-400/35 dark:bg-red-500/14 dark:hover:bg-red-500/18',
    textPrimary: 'text-red-700 dark:text-red-300',
    textSecondary: 'text-red-700/75 dark:text-red-200/75',
    checkbox: 'border-red-500/35 data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:text-white dark:border-red-400/40 dark:data-[state=checked]:border-red-500 dark:data-[state=checked]:bg-red-500',
    countBadge: 'border-red-500/30 text-red-700 dark:border-red-400/35 dark:text-red-300',
    copyButton: 'text-red-700/85 hover:bg-red-500/15 hover:text-red-800 dark:text-red-300/90 dark:hover:bg-red-500/22 dark:hover:text-red-100',
    favoriteButton: 'text-red-700/75 hover:bg-red-500/15 hover:text-red-800 dark:text-red-300/85 dark:hover:bg-red-500/22 dark:hover:text-red-100',
    favoriteButtonActive: 'bg-red-500/16 text-red-800 hover:bg-red-500/20 dark:bg-red-500/24 dark:text-red-100'
  },
  months: {
    surface: 'border-orange-500/28 bg-orange-500/12 hover:bg-orange-500/17 dark:border-orange-400/38 dark:bg-orange-500/16 dark:hover:bg-orange-500/20',
    textPrimary: 'text-orange-800 dark:text-orange-300',
    textSecondary: 'text-orange-800/75 dark:text-orange-200/75',
    checkbox: 'border-orange-500/40 data-[state=checked]:border-orange-600 data-[state=checked]:bg-orange-600 data-[state=checked]:text-white dark:border-orange-400/45 dark:data-[state=checked]:border-orange-500 dark:data-[state=checked]:bg-orange-500',
    countBadge: 'border-orange-500/32 text-orange-800 dark:border-orange-400/38 dark:text-orange-300',
    copyButton: 'text-orange-800/85 hover:bg-orange-500/15 hover:text-orange-900 dark:text-orange-300/90 dark:hover:bg-orange-500/22 dark:hover:text-orange-100',
    favoriteButton: 'text-orange-800/75 hover:bg-orange-500/15 hover:text-orange-900 dark:text-orange-300/85 dark:hover:bg-orange-500/22 dark:hover:text-orange-100',
    favoriteButtonActive: 'bg-orange-500/18 text-orange-900 hover:bg-orange-500/22 dark:bg-orange-500/25 dark:text-orange-100'
  },
  weeks: {
    surface: 'border-yellow-500/25 bg-yellow-500/10 hover:bg-yellow-500/15 dark:border-yellow-400/35 dark:bg-yellow-500/14 dark:hover:bg-yellow-500/18',
    textPrimary: 'text-yellow-700 dark:text-yellow-300',
    textSecondary: 'text-yellow-700/75 dark:text-yellow-200/75',
    checkbox: 'border-yellow-500/35 data-[state=checked]:border-yellow-600 data-[state=checked]:bg-yellow-600 data-[state=checked]:text-white dark:border-yellow-400/40 dark:data-[state=checked]:border-yellow-500 dark:data-[state=checked]:bg-yellow-500 dark:data-[state=checked]:text-zinc-950',
    countBadge: 'border-yellow-500/30 text-yellow-700 dark:border-yellow-400/35 dark:text-yellow-300',
    copyButton: 'text-yellow-700/85 hover:bg-yellow-500/15 hover:text-yellow-800 dark:text-yellow-300/90 dark:hover:bg-yellow-500/22 dark:hover:text-yellow-100',
    favoriteButton: 'text-yellow-700/75 hover:bg-yellow-500/15 hover:text-yellow-800 dark:text-yellow-300/85 dark:hover:bg-yellow-500/22 dark:hover:text-yellow-100',
    favoriteButtonActive: 'bg-yellow-500/18 text-yellow-800 hover:bg-yellow-500/22 dark:bg-yellow-500/24 dark:text-yellow-100'
  },
  days: {
    surface: 'border-green-500/25 bg-green-500/10 hover:bg-green-500/15 dark:border-green-400/35 dark:bg-green-500/14 dark:hover:bg-green-500/18',
    textPrimary: 'text-green-700 dark:text-green-300',
    textSecondary: 'text-green-700/75 dark:text-green-200/75',
    checkbox: 'border-green-500/35 data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white dark:border-green-400/40 dark:data-[state=checked]:border-green-500 dark:data-[state=checked]:bg-green-500',
    countBadge: 'border-green-500/30 text-green-700 dark:border-green-400/35 dark:text-green-300',
    copyButton: 'text-green-700/85 hover:bg-green-500/15 hover:text-green-800 dark:text-green-300/90 dark:hover:bg-green-500/22 dark:hover:text-green-100',
    favoriteButton: 'text-green-700/75 hover:bg-green-500/15 hover:text-green-800 dark:text-green-300/85 dark:hover:bg-green-500/22 dark:hover:text-green-100',
    favoriteButtonActive: 'bg-green-500/16 text-green-800 hover:bg-green-500/20 dark:bg-green-500/24 dark:text-green-100'
  },
  hours: {
    surface: 'border-cyan-500/25 bg-cyan-500/10 hover:bg-cyan-500/15 dark:border-cyan-400/35 dark:bg-cyan-500/14 dark:hover:bg-cyan-500/18',
    textPrimary: 'text-cyan-700 dark:text-cyan-300',
    textSecondary: 'text-cyan-700/75 dark:text-cyan-200/75',
    checkbox: 'border-cyan-500/35 data-[state=checked]:border-cyan-600 data-[state=checked]:bg-cyan-600 data-[state=checked]:text-white dark:border-cyan-400/40 dark:data-[state=checked]:border-cyan-500 dark:data-[state=checked]:bg-cyan-500',
    countBadge: 'border-cyan-500/30 text-cyan-700 dark:border-cyan-400/35 dark:text-cyan-300',
    copyButton: 'text-cyan-700/85 hover:bg-cyan-500/15 hover:text-cyan-800 dark:text-cyan-300/90 dark:hover:bg-cyan-500/22 dark:hover:text-cyan-100',
    favoriteButton: 'text-cyan-700/75 hover:bg-cyan-500/15 hover:text-cyan-800 dark:text-cyan-300/85 dark:hover:bg-cyan-500/22 dark:hover:text-cyan-100',
    favoriteButtonActive: 'bg-cyan-500/16 text-cyan-800 hover:bg-cyan-500/20 dark:bg-cyan-500/24 dark:text-cyan-100'
  },
  minutes: {
    surface: 'border-blue-500/25 bg-blue-500/10 hover:bg-blue-500/15 dark:border-blue-400/35 dark:bg-blue-500/14 dark:hover:bg-blue-500/18',
    textPrimary: 'text-blue-700 dark:text-blue-300',
    textSecondary: 'text-blue-700/75 dark:text-blue-200/75',
    checkbox: 'border-blue-500/35 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:border-blue-400/40 dark:data-[state=checked]:border-blue-500 dark:data-[state=checked]:bg-blue-500',
    countBadge: 'border-blue-500/30 text-blue-700 dark:border-blue-400/35 dark:text-blue-300',
    copyButton: 'text-blue-700/85 hover:bg-blue-500/15 hover:text-blue-800 dark:text-blue-300/90 dark:hover:bg-blue-500/22 dark:hover:text-blue-100',
    favoriteButton: 'text-blue-700/75 hover:bg-blue-500/15 hover:text-blue-800 dark:text-blue-300/85 dark:hover:bg-blue-500/22 dark:hover:text-blue-100',
    favoriteButtonActive: 'bg-blue-500/16 text-blue-800 hover:bg-blue-500/20 dark:bg-blue-500/24 dark:text-blue-100'
  },
  seconds: {
    surface: 'border-violet-500/25 bg-violet-500/10 hover:bg-violet-500/15 dark:border-violet-400/35 dark:bg-violet-500/14 dark:hover:bg-violet-500/18',
    textPrimary: 'text-violet-700 dark:text-violet-300',
    textSecondary: 'text-violet-700/75 dark:text-violet-200/75',
    checkbox: 'border-violet-500/35 data-[state=checked]:border-violet-600 data-[state=checked]:bg-violet-600 data-[state=checked]:text-white dark:border-violet-400/40 dark:data-[state=checked]:border-violet-500 dark:data-[state=checked]:bg-violet-500',
    countBadge: 'border-violet-500/30 text-violet-700 dark:border-violet-400/35 dark:text-violet-300',
    copyButton: 'text-violet-700/85 hover:bg-violet-500/15 hover:text-violet-800 dark:text-violet-300/90 dark:hover:bg-violet-500/22 dark:hover:text-violet-100',
    favoriteButton: 'text-violet-700/75 hover:bg-violet-500/15 hover:text-violet-800 dark:text-violet-300/85 dark:hover:bg-violet-500/22 dark:hover:text-violet-100',
    favoriteButtonActive: 'bg-violet-500/16 text-violet-800 hover:bg-violet-500/20 dark:bg-violet-500/24 dark:text-violet-100'
  }
}

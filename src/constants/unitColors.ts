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

const SHARED_TEXT_PRIMARY = 'text-foreground'
const SHARED_TEXT_SECONDARY = 'text-muted-foreground'
const SHARED_COUNT_BADGE = 'border-border/70 bg-background/60 text-foreground'
const SHARED_COPY_BUTTON = 'text-foreground/85 hover:bg-background/65 hover:text-foreground'
const SHARED_FAVORITE_BUTTON = 'text-foreground/75 hover:bg-background/65 hover:text-foreground'
const SHARED_FAVORITE_ACTIVE = 'bg-background/75 text-foreground hover:bg-background/90'

export const UNIT_COLOR_CLASSES: Record<Unit, UnitColorClasses> = {
  years: {
    surface: 'border-violet-700/35 bg-violet-700/18 hover:bg-violet-700/24',
    textPrimary: SHARED_TEXT_PRIMARY,
    textSecondary: SHARED_TEXT_SECONDARY,
    checkbox: 'border-violet-500/50 data-[state=checked]:border-violet-500 data-[state=checked]:bg-violet-500 data-[state=checked]:text-white',
    countBadge: SHARED_COUNT_BADGE,
    copyButton: SHARED_COPY_BUTTON,
    favoriteButton: SHARED_FAVORITE_BUTTON,
    favoriteButtonActive: SHARED_FAVORITE_ACTIVE
  },
  months: {
    surface: 'border-indigo-600/35 bg-indigo-600/18 hover:bg-indigo-600/24',
    textPrimary: SHARED_TEXT_PRIMARY,
    textSecondary: SHARED_TEXT_SECONDARY,
    checkbox: 'border-indigo-500/50 data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-500 data-[state=checked]:text-white',
    countBadge: SHARED_COUNT_BADGE,
    copyButton: SHARED_COPY_BUTTON,
    favoriteButton: SHARED_FAVORITE_BUTTON,
    favoriteButtonActive: SHARED_FAVORITE_ACTIVE
  },
  weeks: {
    surface: 'border-blue-600/35 bg-blue-600/18 hover:bg-blue-600/24',
    textPrimary: SHARED_TEXT_PRIMARY,
    textSecondary: SHARED_TEXT_SECONDARY,
    checkbox: 'border-blue-500/50 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white',
    countBadge: SHARED_COUNT_BADGE,
    copyButton: SHARED_COPY_BUTTON,
    favoriteButton: SHARED_FAVORITE_BUTTON,
    favoriteButtonActive: SHARED_FAVORITE_ACTIVE
  },
  days: {
    surface: 'border-sky-600/35 bg-sky-600/18 hover:bg-sky-600/24',
    textPrimary: SHARED_TEXT_PRIMARY,
    textSecondary: SHARED_TEXT_SECONDARY,
    checkbox: 'border-sky-500/50 data-[state=checked]:border-sky-500 data-[state=checked]:bg-sky-500 data-[state=checked]:text-white',
    countBadge: SHARED_COUNT_BADGE,
    copyButton: SHARED_COPY_BUTTON,
    favoriteButton: SHARED_FAVORITE_BUTTON,
    favoriteButtonActive: SHARED_FAVORITE_ACTIVE
  },
  hours: {
    surface: 'border-cyan-600/35 bg-cyan-600/18 hover:bg-cyan-600/24',
    textPrimary: SHARED_TEXT_PRIMARY,
    textSecondary: SHARED_TEXT_SECONDARY,
    checkbox: 'border-cyan-500/50 data-[state=checked]:border-cyan-500 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-white',
    countBadge: SHARED_COUNT_BADGE,
    copyButton: SHARED_COPY_BUTTON,
    favoriteButton: SHARED_FAVORITE_BUTTON,
    favoriteButtonActive: SHARED_FAVORITE_ACTIVE
  },
  minutes: {
    surface: 'border-teal-600/35 bg-teal-600/18 hover:bg-teal-600/24',
    textPrimary: SHARED_TEXT_PRIMARY,
    textSecondary: SHARED_TEXT_SECONDARY,
    checkbox: 'border-teal-500/50 data-[state=checked]:border-teal-500 data-[state=checked]:bg-teal-500 data-[state=checked]:text-white',
    countBadge: SHARED_COUNT_BADGE,
    copyButton: SHARED_COPY_BUTTON,
    favoriteButton: SHARED_FAVORITE_BUTTON,
    favoriteButtonActive: SHARED_FAVORITE_ACTIVE
  },
  seconds: {
    surface: 'border-emerald-600/35 bg-emerald-600/18 hover:bg-emerald-600/24',
    textPrimary: SHARED_TEXT_PRIMARY,
    textSecondary: SHARED_TEXT_SECONDARY,
    checkbox: 'border-emerald-500/50 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white',
    countBadge: SHARED_COUNT_BADGE,
    copyButton: SHARED_COPY_BUTTON,
    favoriteButton: SHARED_FAVORITE_BUTTON,
    favoriteButtonActive: SHARED_FAVORITE_ACTIVE
  }
}

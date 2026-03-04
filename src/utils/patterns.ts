import { CONFIG } from '../types'

const K_SET = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export function isPowerOf10(n: number): boolean {
  if (n < 10) return false
  let num = n
  while (num % 10 === 0) num /= 10
  return num === 1
}

export function isKTimesPow10(n: number): boolean {
  let m = n
  while (m % 10 === 0) m /= 10
  return K_SET.includes(m)
}

export function isRounded(n: number): boolean {
  return isPowerOf10(n) || isKTimesPow10(n)
}

export function isRepdigit(n: number): boolean {
  const s = String(n)
  return s.length > 1 && /^([1-9])\1+$/.test(s)
}

export function isAscending(n: number): boolean {
  const s = String(n)
  if (!/^\d+$/.test(s) || s.length < 3) return false

  for (let i = 1; i < s.length; i++) {
    const prev = Number(s[i - 1])
    const curr = Number(s[i])
    if (curr !== prev + 1) return false
  }

  return true
}

function makePowersOf10(max: number): Set<number> {
  const set = new Set<number>()
  for (let k = 1; 10 ** k <= max; k++) {
    set.add(10 ** k)
  }
  return set
}

function makeKTimesPow10(max: number): Set<number> {
  const set = new Set<number>()
  for (const K of K_SET) {
    for (let k = 0; ; k++) {
      const v = K * 10 ** k
      if (v > max) break
      set.add(v)
    }
  }
  return set
}

function makeRepdigits(max: number): Set<number> {
  const set = new Set<number>()
  for (let len = 2; len <= CONFIG.REPDIGIT_MAX_LENGTH; len++) {
    for (let d = 1; d <= 9; d++) {
      const v = Number(String(d).repeat(len))
      if (v <= max) set.add(v)
    }
  }
  return set
}

function makeAscending(max: number): Set<number> {
  const set = new Set<number>()

  for (let start = 1; start <= 7; start++) {
    let value = 0
    for (let digit = start; digit <= 9; digit++) {
      value = value * 10 + digit
      if (value > max) break
      if (digit - start + 1 >= 3) {
        set.add(value)
      }
    }
  }

  return set
}

export interface PatternOptions {
  rounded: boolean
  repdigit: boolean
  ascending: boolean
}

export function buildCandidates(maxN: number, patterns: PatternOptions): number[] {
  const s = new Set<number>()
  if (patterns.rounded) {
    for (const v of makePowersOf10(maxN)) s.add(v)
    for (const v of makeKTimesPow10(maxN)) s.add(v)
  }
  if (patterns.repdigit) {
    for (const v of makeRepdigits(maxN)) s.add(v)
  }
  if (patterns.ascending) {
    for (const v of makeAscending(maxN)) s.add(v)
  }
  return Array.from(s).sort((a, b) => a - b)
}

export function classifyPatterns(n: number): { rounded: boolean; repdigit: boolean; ascending: boolean } {
  return {
    rounded: isRounded(n),
    repdigit: isRepdigit(n),
    ascending: isAscending(n)
  }
}

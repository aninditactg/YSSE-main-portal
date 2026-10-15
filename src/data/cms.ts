import { replaceContent } from './mockData'

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'
export type CMSSettings = Record<string, any>
export let siteSettings: CMSSettings = {}
let loaded = false

export async function refreshCMS(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/public/site`, { cache: 'no-store' })
    if (!response.ok) return false
    const payload = await response.json()
    replaceContent(payload.collections || {})
    siteSettings = payload.settings || {}
    loaded = true
    window.dispatchEvent(new CustomEvent('ysse:cms-updated'))
    return true
  } catch {
    // The public site remains viewable with bundled starter content while MySQL/API is unavailable.
    return false
  }
}
export function isCMSLoaded() { return loaded }

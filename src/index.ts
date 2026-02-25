/**
 * @workspace/d3-hierarchical-grid
 * 
 * A React component library for rendering hierarchical data using D3.js in grid layouts.
 */

// Main exports will be added here as components are developed
export const version = '0.1.0'

// Export all types
export * from './types'

// Export hooks
export { useZoom } from './hooks/useZoom'
export type { UseZoomOptions, UseZoomReturn } from './hooks/useZoom'

// Export main component
export { HierarchicalGrid } from './components/HierarchicalGrid'

// Export configuration and defaults
export { DEFAULT_THEME, DEFAULT_TYPOGRAPHY_CONFIG } from './config/defaults'

// Export layout computation
export { computeLayout } from './layout/compute'

// Export renderer utilities
export {
  renderSections,
  renderGroups,
  renderItems,
  updateItemContent,
  updateHeadingStyles,
} from './utils/renderer'

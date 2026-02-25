import type { GridTheme } from '../types';

/**
 * Default theme configuration for the hierarchical grid visualization.
 * These values can be overridden via the `theme` prop on HierarchicalGrid.
 *
 * @example
 * ```typescript
 * <HierarchicalGrid
 *   items={items}
 *   theme={{
 *     section: { backgroundColor: '#f5f5f5' },
 *     zoom: { minScale: 0.5, maxScale: 2.0 }
 *   }}
 * />
 * ```
 */
export const DEFAULT_THEME: GridTheme = {
  /**
   * Section (top-level container) styling.
   * Sections organize groups into logical categories.
   */
  section: {
    padding: 16,
    gap: 12,
    headerHeight: 32,
    backgroundColor: '#ffffff',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
  },

  /**
   * Group (cluster) styling.
   * Groups contain collections of related items.
   */
  group: {
    padding: 12,
    gap: 8,
    headerHeight: 28,
    minWidth: 180,
    backgroundColor: '#fafafa',
    borderColor: '#d0d0d0',
    borderWidth: 1,
    borderRadius: 6,
  },

  /**
   * Item (individual element) styling.
   * Items are the atomic units in the grid.
   */
  item: {
    width: 80,
    height: 100,
    gap: 6,
    padding: 8,
    backgroundColor: '#ffffff',
    hoverBackgroundColor: '#f0f7ff',
    selectedBackgroundColor: '#e3f2fd',
    borderColor: '#c0c0c0',
    borderWidth: 1,
    borderRadius: 4,
  },

  /**
   * Minimap styling.
   * The minimap provides an overview of the entire grid.
   */
  minimap: {
    maxWidth: 200,
    maxHeight: 150,
    backgroundColor: '#fafafa',
    viewportColor: '#2196f3',
    sectionOpacity: 0.6,
  },

  /**
   * Zoom behavior configuration.
   * Controls zoom interaction and animation parameters.
   */
  zoom: {
    /** Minimum zoom scale (30% of original size) */
    minScale: 0.3,
    /** Maximum zoom scale (150% of original size) */
    maxScale: 1.5,
    /** Zoom step for button controls (20% per click) */
    step: 0.2,
    /** Mouse wheel sensitivity factor (lower = less sensitive) */
    wheelDeltaFactor: 0.002,
    /** Transition duration in milliseconds for smooth animations */
    smoothness: 250,
  },
};

/**
 * Default typography configuration for zoom-based heading styles.
 * Used by updateHeadingStyles to adjust font sizes at different zoom levels.
 */
export const DEFAULT_TYPOGRAPHY_CONFIG = {
  thresholds: [0.3, 0.6, 1.0, 1.3],
  fontSizes: {
    sections: [12, 14, 16, 18],
    groups: [10, 12, 14, 15],
  },
  fontWeights: {
    sections: ['500', '600', '600', '700'],
    groups: ['400', '500', '500', '600'],
  },
};

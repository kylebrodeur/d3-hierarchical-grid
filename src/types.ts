import type { ZoomTransform } from 'd3';

// ============================================================================
// Core Data Types
// ============================================================================

/**
 * Main data item representing a single element in the hierarchical grid.
 * Each item belongs to a group and optionally a section.
 */
export interface HierarchyItem {
  /** Unique identifier for the item */
  id: string;
  /** Display name of the item */
  name: string;
  /** Group/cluster this item belongs to */
  group: string;
  /** Optional top-level section this item belongs to */
  section?: string;
  /** Optional description text */
  description?: string;
  /** Optional image/icon URL */
  imageUrl?: string;
  /** Optional external URL */
  url?: string;
  /** Flexible metadata for additional fields */
  metadata?: Record<string, unknown>;
  /** Optional explicit position (null values indicate auto-layout) */
  position?: { x: number | null; y: number | null };
}

/**
 * Complete layout computation result containing all positioned elements
 * and overall grid dimensions.
 */
export interface LayoutResult {
  /** Array of positioned sections (top-level containers) */
  sections: LayoutSection[];
  /** Array of positioned groups (clusters of items) */
  groups: LayoutGroup[];
  /** Array of positioned items (individual elements) */
  items: LayoutItem[];
  /** Overall grid dimensions */
  bounds: { width: number; height: number };
  /** Layout statistics */
  stats: { totalSections: number; totalGroups: number; totalItems: number };
}

/**
 * A positioned section (top-level container) in the layout.
 * Sections contain multiple groups.
 */
export interface LayoutSection {
  /** Unique identifier for this section instance */
  id: string;
  /** The section key from config or derived from data */
  sectionKey: string;
  /** Absolute x position in layout */
  x: number;
  /** Absolute y position in layout */
  y: number;
  /** Width of the section */
  width: number;
  /** Height of the section */
  height: number;
  /** Display label */
  label: string;
  /** Optional color override */
  color?: string;
}

/**
 * A positioned group (cluster) within a section.
 * Groups contain multiple items.
 */
export interface LayoutGroup {
  /** Unique identifier for this group instance */
  id: string;
  /** ID of the parent section */
  sectionId: string;
  /** Key of the parent section */
  sectionKey: string;
  /** Group/cluster identifier */
  group: string;
  /** Optional description text */
  description?: string;
  /** Absolute x position in layout */
  x: number;
  /** Absolute y position in layout */
  y: number;
  /** Width of the group */
  width: number;
  /** Height of the group */
  height: number;
  /** Number of items in this group */
  count: number;
  /** X position relative to parent section */
  relativeX: number;
  /** Y position relative to parent section */
  relativeY: number;
}

/**
 * A positioned item (individual element) within a group.
 */
export interface LayoutItem {
  /** Unique identifier for this layout instance */
  id: string;
  /** ID of the source data item */
  itemId: string;
  /** Key of the parent section */
  sectionKey: string;
  /** Group/cluster identifier */
  group: string;
  /** ID of the parent group */
  groupId: string;
  /** Absolute x position in layout */
  x: number;
  /** Absolute y position in layout */
  y: number;
  /** Width of the item */
  width: number;
  /** Height of the item */
  height: number;
  /** X position relative to parent group */
  relativeX: number;
  /** Y position relative to parent group */
  relativeY: number;
  /** Reference to the original data item */
  dataRef: HierarchyItem;
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Configuration for the grid layout, defining sections and groups.
 */
export interface GridConfig {
  /** Optional array of section definitions */
  sections?: SectionDefinition[];
  /** Optional array of group definitions */
  groups?: GroupDefinition[];
}

/**
 * Definition of a section (top-level container).
 */
export interface SectionDefinition {
  /** Unique key for this section */
  key: string;
  /** Display label */
  label: string;
  /** Optional color override */
  color?: string;
  /** Optional order for sorting sections */
  order?: number;
}

/**
 * Definition of a group (cluster of items).
 */
export interface GroupDefinition {
  /** Unique key for this group */
  key: string;
  /** Display label */
  label: string;
  /** Optional description text */
  description?: string;
  /** Optional color override */
  color?: string;
}

// ============================================================================
// Styling/Theme Types
// ============================================================================

/**
 * Complete theme configuration for the grid visualization.
 * Controls visual appearance of all elements.
 */
export interface GridTheme {
  /** Styling for sections (top-level containers) */
  section: SectionStyles;
  /** Styling for groups (clusters) */
  group: GroupStyles;
  /** Styling for items (individual elements) */
  item: ItemStyles;
  /** Styling for the minimap */
  minimap: MinimapStyles;
  /** Zoom behavior configuration */
  zoom: ZoomConfig;
}

/**
 * Visual styling for sections (top-level containers).
 */
export interface SectionStyles {
  /** Inner padding of the section */
  padding: number;
  /** Gap between groups within the section */
  gap: number;
  /** Height of the section header */
  headerHeight: number;
  /** Background color */
  backgroundColor: string;
  /** Border color */
  borderColor: string;
  /** Border width */
  borderWidth: number;
  /** Border radius */
  borderRadius: number;
}

/**
 * Visual styling for groups (clusters).
 */
export interface GroupStyles {
  /** Inner padding of the group */
  padding: number;
  /** Gap between items within the group */
  gap: number;
  /** Height of the group header */
  headerHeight: number;
  /** Minimum width of a group */
  minWidth: number;
  /** Background color */
  backgroundColor: string;
  /** Border color */
  borderColor: string;
  /** Border width */
  borderWidth: number;
  /** Border radius */
  borderRadius: number;
}

/**
 * Visual styling for items (individual elements).
 */
export interface ItemStyles {
  /** Width of an item */
  width: number;
  /** Height of an item */
  height: number;
  /** Gap between items */
  gap: number;
  /** Inner padding of the item */
  padding: number;
  /** Background color in default state */
  backgroundColor: string;
  /** Background color on hover */
  hoverBackgroundColor: string;
  /** Background color when selected */
  selectedBackgroundColor: string;
  /** Border color */
  borderColor: string;
  /** Border width */
  borderWidth: number;
  /** Border radius */
  borderRadius: number;
}

/**
 * Visual styling for the minimap component.
 */
export interface MinimapStyles {
  /** Maximum width of the minimap */
  maxWidth: number;
  /** Maximum height of the minimap */
  maxHeight: number;
  /** Background color */
  backgroundColor: string;
  /** Color of the viewport rectangle */
  viewportColor: string;
  /** Opacity of section representations */
  sectionOpacity: number;
}

/**
 * Configuration for zoom behavior.
 */
export interface ZoomConfig {
  /** Minimum zoom scale */
  minScale: number;
  /** Maximum zoom scale */
  maxScale: number;
  /** Zoom step for controls */
  step: number;
  /** Factor for mouse wheel zoom sensitivity */
  wheelDeltaFactor: number;
  /** Smoothness of zoom transitions (0-1) */
  smoothness: number;
}

// ============================================================================
// Interaction Types
// ============================================================================

/**
 * Mouse click position in screen coordinates.
 */
export interface ClickPosition {
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
}

/**
 * Position and dimensions of an element in layout coordinates.
 */
export interface LayoutPosition {
  /** X position */
  x: number;
  /** Y position */
  y: number;
  /** Width */
  width: number;
  /** Height */
  height: number;
}

/**
 * Options for the fit-to-view operation.
 */
export interface FitToViewOptions {
  /** Whether to animate the transition */
  animate?: boolean;
  /** Reason for the fit operation (for logging/debugging) */
  reason?: 'auto' | 'manual' | 'resize' | 'safe-area';
}

/**
 * Control methods exposed by the grid for external interactions.
 */
export interface GridControls {
  /** Zoom in by one step */
  zoomIn: () => void;
  /** Zoom out by one step */
  zoomOut: () => void;
  /** Reset zoom to 1:1 scale */
  resetZoom: () => void;
  /** Clear any active highlight */
  clearHighlight: () => void;
  /** Fit the entire grid into the viewport */
  fitToView: (options?: FitToViewOptions) => void;
  /** Pan the view by the specified delta */
  panBy: (dx: number, dy: number, duration?: number) => void;
  /** Create or update the minimap */
  createMinimap: (layout?: LayoutResult, container?: HTMLDivElement) => void;
}

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Props for the main HierarchicalGrid component.
 * Defines all configuration, data, and callback handlers.
 */
export interface HierarchicalGridProps {
  /** Array of data items to display */
  items: HierarchyItem[];
  /** Optional configuration for sections and groups */
  config?: GridConfig | null;
  /** Currently selected item (for highlighting) */
  selectedItem?: HierarchyItem | null;
  /** Optional theme overrides (merged with defaults) */
  theme?: Partial<GridTheme>;
  /** Callback when an item is clicked */
  onItemClick?: (
    item: HierarchyItem,
    clickPosition?: ClickPosition,
    layoutPosition?: LayoutPosition
  ) => void;
  /** Callback when an item is hovered or hover ends */
  onItemHover?: (item: HierarchyItem | null) => void;
  /** Callback when the background (empty area) is clicked */
  onBackgroundClick?: () => void;
  /** Callback when zoom/pan transform changes */
  onTransformChange?: (transform: ZoomTransform) => void;
  /** Callback when controls are ready (provides control methods) */
  onControlsReady?: (controls: GridControls) => void;
  /** Callback when initial fit-to-view completes */
  onInitialFitComplete?: () => void;
  /** Optional CSS class name for the container */
  className?: string;
}

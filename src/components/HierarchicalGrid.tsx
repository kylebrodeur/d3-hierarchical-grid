import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { useZoom } from '../hooks/useZoom';
import {
  renderSections,
  renderGroups,
  renderItems,
  updateItemContent,
  updateHeadingStyles,
} from '../utils/renderer';
import { computeLayout } from '../layout/compute';
import { DEFAULT_THEME, DEFAULT_TYPOGRAPHY_CONFIG } from '../config/defaults';
import type {
  HierarchicalGridProps,
  LayoutResult,
  GridControls,
  FitToViewOptions,
  GridTheme,
  HierarchyItem,
  ClickPosition,
  LayoutPosition,
} from '../types';

/**
 * HierarchicalGrid component - Main visualization component for hierarchical data.
 *
 * This component provides a zoomable, pannable grid visualization that organizes items
 * into groups and sections. It integrates D3 for rendering and interactions with React
 * for component lifecycle management.
 *
 * **Key Features:**
 * - **Hierarchical Layout**: Automatically organizes items into sections and groups
 * - **Zoom & Pan**: Smooth zoom with mouse wheel and programmatic controls
 * - **Progressive Detail**: Conditionally renders content based on zoom level
 * - **Interactive**: Click and hover handlers with highlight management
 * - **Responsive**: Auto-fits content on mount and resize
 * - **SSR Safe**: Guards against server-side rendering issues
 * - **Customizable**: Comprehensive theme and configuration options
 *
 * @example
 * ```typescript
 * const items: HierarchyItem[] = [
 *   { id: '1', name: 'Item 1', group: 'Group A', section: 'Section 1' },
 *   { id: '2', name: 'Item 2', group: 'Group A', section: 'Section 1' },
 * ];
 *
 * function MyApp() {
 *   const [controls, setControls] = useState<GridControls | null>(null);
 *
 *   return (
 *     <div>
 *       <HierarchicalGrid
 *         items={items}
 *         onControlsReady={setControls}
 *         onItemClick={(item) => console.log('Clicked:', item.name)}
 *       />
 *       {controls && (
 *         <div>
 *           <button onClick={controls.zoomIn}>Zoom In</button>
 *           <button onClick={controls.zoomOut}>Zoom Out</button>
 *           <button onClick={controls.resetZoom}>Reset</button>
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function HierarchicalGrid({
  items,
  config,
  selectedItem,
  theme,
  onItemClick,
  onItemHover,
  onBackgroundClick,
  onTransformChange,
  onControlsReady,
  onInitialFitComplete,
  className = '',
}: HierarchicalGridProps): JSX.Element {
  // ============================================================================
  // Refs and State
  // ============================================================================

  /** Reference to the SVG element */
  const svgRef = useRef<SVGSVGElement>(null);

  /** Reference to the container div element */
  const containerRef = useRef<HTMLDivElement>(null);

  /** Reference to the computed layout result */
  const layoutRef = useRef<LayoutResult | null>(null);

  /** Guard for SSR - only render interactive features after mount */
  const [isMounted, setIsMounted] = useState(false);

  /** Track if initial fit-to-view has completed */
  const initialFitCompleteRef = useRef(false);

  /** Track currently highlighted item */
  const [, setHighlightedItemId] = useState<string | null>(null);

  // ============================================================================
  // Theme Merging
  // ============================================================================

  /**
   * Merge user-provided theme with defaults.
   * Uses deep merge to allow partial overrides at any level.
   */
  const mergedTheme = useMemo<GridTheme>(() => {
    if (!theme) return DEFAULT_THEME;

    return {
      section: { ...DEFAULT_THEME.section, ...theme.section },
      group: { ...DEFAULT_THEME.group, ...theme.group },
      item: { ...DEFAULT_THEME.item, ...theme.item },
      minimap: { ...DEFAULT_THEME.minimap, ...theme.minimap },
      zoom: { ...DEFAULT_THEME.zoom, ...theme.zoom },
    };
  }, [theme]);

  // ============================================================================
  // Zoom Hook Integration
  // ============================================================================

  const { currentTransform, zoomIn, zoomOut, resetZoom, setTransform, panBy } = useZoom({
    svgRef,
    containerRef,
    config: mergedTheme.zoom,
    onZoom: (transform) => {
      if (!svgRef.current) return;

      const svg = d3.select(svgRef.current);

      // Update heading styles based on zoom level
      updateHeadingStyles(svg, transform.k, DEFAULT_TYPOGRAPHY_CONFIG);

      // Update item content based on zoom level
      const itemSelection = svg.selectAll<SVGGElement, any>('g.item');
      updateItemContent(itemSelection, transform.k, mergedTheme.item, {
        imageUrlGetter: (item: HierarchyItem) => item.imageUrl || '',
        initialsGetter: (item: HierarchyItem) => {
          const words = item.name.split(' ');
          if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
          }
          return item.name.slice(0, 2).toUpperCase();
        },
      });

      // Notify parent of transform change
      onTransformChange?.(transform);
    },
  });

  // ============================================================================
  // Layout Computation
  // ============================================================================

  /**
   * Recompute layout when items, config, or theme changes.
   * Stores result in ref to avoid unnecessary re-renders.
   */
  useEffect(() => {
    if (!items || items.length === 0) {
      layoutRef.current = {
        sections: [],
        groups: [],
        items: [],
        bounds: { width: 0, height: 0 },
        stats: { totalSections: 0, totalGroups: 0, totalItems: 0 },
      };
      return;
    }

    try {
      const layout = computeLayout(items, config, mergedTheme);
      layoutRef.current = layout;
    } catch (error) {
      console.error('[HierarchicalGrid] Layout computation failed:', error);
      layoutRef.current = null;
    }
  }, [items, config, mergedTheme]);

  // ============================================================================
  // Rendering Effect
  // ============================================================================

  /**
   * Main rendering effect - rebuilds the D3 visualization when layout changes.
   * Uses D3 data joins for efficient updates.
   */
  useEffect(() => {
    if (!svgRef.current || !layoutRef.current || !isMounted) return;

    const svg = d3.select(svgRef.current);
    const layout = layoutRef.current;

    // Set SVG viewBox to match layout bounds
    svg
      .attr('viewBox', `0 0 ${layout.bounds.width} ${layout.bounds.height}`)
      .attr('width', '100%')
      .attr('height', '100%');

    // Get or create content group
    let contentGroup = svg.select<SVGGElement>('g.content-group');
    if (contentGroup.empty()) {
      contentGroup = svg.append('g').attr('class', 'content-group');
    }

    // Clear existing content
    contentGroup.selectAll('*').remove();

    // Render hierarchy using renderers
    try {
      // Render sections
      const sectionSelection = renderSections(contentGroup, layout.sections, mergedTheme.section);

      // Render groups within sections
      const groupSelection = renderGroups(sectionSelection, layout.groups, mergedTheme.group);

      // Render items within groups
      const itemSelection = renderItems(
        groupSelection,
        layout.items,
        mergedTheme.item,
        currentTransform?.k || 1.0,
      );

      // Set up item click handlers
      itemSelection.on('click', function (event: MouseEvent, d) {
        event.stopPropagation();

        const clickPosition: ClickPosition = {
          x: event.clientX,
          y: event.clientY,
        };

        const layoutPosition: LayoutPosition = {
          x: d.x,
          y: d.y,
          width: d.width,
          height: d.height,
        };

        onItemClick?.(d.dataRef, clickPosition, layoutPosition);
      });

      // Set up item hover handlers
      itemSelection
        .on('mouseenter', function (_event: MouseEvent, d) {
          setHighlightedItemId(d.itemId);
          onItemHover?.(d.dataRef);
        })
        .on('mouseleave', function () {
          setHighlightedItemId(null);
          onItemHover?.(null);
        });

      // Set up background click handler
      svg.on('click', function (event: MouseEvent) {
        // Only trigger if clicking directly on SVG (not on items)
        if (event.target === svg.node()) {
          onBackgroundClick?.();
        }
      });

      // Initial content update based on zoom
      if (currentTransform) {
        updateHeadingStyles(svg, currentTransform.k, DEFAULT_TYPOGRAPHY_CONFIG);
        updateItemContent(itemSelection, currentTransform.k, mergedTheme.item, {
          imageUrlGetter: (item: HierarchyItem) => item.imageUrl || '',
          initialsGetter: (item: HierarchyItem) => {
            const words = item.name.split(' ');
            if (words.length >= 2) {
              return (words[0][0] + words[1][0]).toUpperCase();
            }
            return item.name.slice(0, 2).toUpperCase();
          },
        });
      }
    } catch (error) {
      console.error('[HierarchicalGrid] Rendering failed:', error);
    }
  }, [
    layoutRef.current,
    mergedTheme,
    isMounted,
    onItemClick,
    onItemHover,
    onBackgroundClick,
    currentTransform,
  ]);

  // ============================================================================
  // Highlight Management
  // ============================================================================

  /**
   * Update visual highlight when selectedItem prop changes.
   */
  useEffect(() => {
    if (!svgRef.current || !isMounted) return;

    const svg = d3.select(svgRef.current);
    const itemSelection = svg.selectAll<SVGGElement, any>('g.item');

    // Clear all highlights
    itemSelection
      .select<SVGRectElement>('rect.item-background')
      .attr('fill', mergedTheme.item.backgroundColor)
      .attr('stroke', mergedTheme.item.borderColor)
      .attr('stroke-width', mergedTheme.item.borderWidth);

    // Apply highlight to selected item
    if (selectedItem) {
      itemSelection
        .filter((d: any) => d.itemId === selectedItem.id)
        .select<SVGRectElement>('rect.item-background')
        .attr('fill', mergedTheme.item.selectedBackgroundColor)
        .attr('stroke', '#2196f3')
        .attr('stroke-width', 2);
    }
  }, [selectedItem, mergedTheme.item, isMounted]);

  // ============================================================================
  // Fit-to-View Implementation
  // ============================================================================

  /**
   * Fits the entire grid into the viewport with optional padding.
   * Calculates the appropriate transform to show all content.
   */
  const fitToView = useCallback(
    (options?: FitToViewOptions) => {
      if (!containerRef.current || !layoutRef.current || !setTransform) {
        console.warn('[HierarchicalGrid] Cannot fit to view - refs not ready');
        return;
      }

      const layout = layoutRef.current;
      const container = containerRef.current;

      // Get container dimensions
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      if (containerWidth === 0 || containerHeight === 0) {
        console.warn('[HierarchicalGrid] Container has zero dimensions');
        return;
      }

      // Calculate scale to fit content with padding
      const padding = 40; // Pixels of padding around content
      const scaleX = (containerWidth - padding * 2) / layout.bounds.width;
      const scaleY = (containerHeight - padding * 2) / layout.bounds.height;
      const scale = Math.min(scaleX, scaleY, 1.0); // Don't zoom in beyond 1:1

      // Constrain scale to zoom limits
      const constrainedScale = Math.max(
        mergedTheme.zoom.minScale,
        Math.min(mergedTheme.zoom.maxScale, scale),
      );

      // Calculate translation to center content
      const contentWidth = layout.bounds.width * constrainedScale;
      const contentHeight = layout.bounds.height * constrainedScale;
      const translateX = (containerWidth - contentWidth) / 2;
      const translateY = (containerHeight - contentHeight) / 2;

      // Create new transform
      const newTransform = d3.zoomIdentity
        .translate(translateX, translateY)
        .scale(constrainedScale);

      // Apply transform
      const animate = options?.animate !== false; // Default to true
      setTransform(newTransform, animate);

      // Log for debugging
      const reason = options?.reason || 'manual';
      console.log(
        `[HierarchicalGrid] Fit to view (${reason}):`,
        `scale=${constrainedScale.toFixed(2)}`,
        `translate=[${translateX.toFixed(0)}, ${translateY.toFixed(0)}]`,
      );
    },
    [layoutRef.current, containerRef.current, setTransform, mergedTheme.zoom],
  );

  // ============================================================================
  // Highlight Control
  // ============================================================================

  /**
   * Clears any active highlight from the grid.
   */
  const clearHighlight = useCallback(() => {
    setHighlightedItemId(null);
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg
      .selectAll<SVGRectElement, any>('rect.item-background')
      .attr('fill', mergedTheme.item.backgroundColor)
      .attr('stroke', mergedTheme.item.borderColor)
      .attr('stroke-width', mergedTheme.item.borderWidth);
  }, [mergedTheme.item]);

  // ============================================================================
  // Minimap Implementation (Placeholder)
  // ============================================================================

  /**
   * Creates a minimap for the grid visualization.
   * This is a placeholder for future implementation.
   */
  const createMinimap = useCallback((_layout?: LayoutResult, _container?: HTMLDivElement) => {
    console.log('[HierarchicalGrid] Minimap creation not yet implemented');
    // TODO: Implement minimap rendering
    // - Create scaled-down version of the grid
    // - Show viewport rectangle
    // - Allow clicking to pan main view
    // - Update on zoom/pan changes
  }, []);

  // ============================================================================
  // Controls Exposure
  // ============================================================================

  /**
   * Expose control methods to parent component via onControlsReady callback.
   */
  useEffect(() => {
    if (!isMounted || !onControlsReady) return;

    const controls: GridControls = {
      zoomIn,
      zoomOut,
      resetZoom,
      clearHighlight,
      fitToView,
      panBy,
      createMinimap,
    };

    onControlsReady(controls);
  }, [
    isMounted,
    zoomIn,
    zoomOut,
    resetZoom,
    clearHighlight,
    fitToView,
    panBy,
    createMinimap,
    onControlsReady,
  ]);

  // ============================================================================
  // Resize Observer
  // ============================================================================

  /**
   * Handles responsive behavior - refits content when container resizes.
   */
  useEffect(() => {
    if (!containerRef.current || !isMounted) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          // Refit to view on resize
          setTimeout(() => {
            fitToView({ animate: false, reason: 'resize' });
          }, 100);
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isMounted, fitToView]);

  // ============================================================================
  // Initial Mount and Fit
  // ============================================================================

  /**
   * Handles mount lifecycle - sets isMounted flag and performs initial fit.
   */
  useEffect(() => {
    setIsMounted(true);

    // Perform initial fit-to-view after a short delay
    // to ensure layout is computed and rendered
    const timer = setTimeout(() => {
      if (layoutRef.current && !initialFitCompleteRef.current) {
        fitToView({ animate: true, reason: 'auto' });
        initialFitCompleteRef.current = true;
        onInitialFitComplete?.();
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      setIsMounted(false);
    };
  }, []);

  /**
   * Refit when layout changes (new data loaded).
   */
  useEffect(() => {
    if (isMounted && layoutRef.current && initialFitCompleteRef.current) {
      // Data changed after initial load - refit
      setTimeout(() => {
        fitToView({ animate: true, reason: 'auto' });
      }, 150);
    }
  }, [layoutRef.current, isMounted, fitToView]);

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <div
      ref={containerRef}
      className={`hierarchical-grid-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#fafafa',
      }}
    >
      <svg
        ref={svgRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        {/* Content group is created dynamically by D3 */}
      </svg>
      {!isMounted && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#666',
            fontSize: '14px',
          }}
        >
          Loading...
        </div>
      )}
      {isMounted && items.length === 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#999',
            fontSize: '14px',
            textAlign: 'center',
          }}
        >
          No items to display
        </div>
      )}
    </div>
  );
}

/**
 * Display name for React DevTools.
 */
HierarchicalGrid.displayName = 'HierarchicalGrid';

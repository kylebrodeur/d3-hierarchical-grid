import { useEffect, useRef, useState, RefObject, useCallback } from 'react';
import * as d3 from 'd3';
import type { ZoomTransform } from 'd3';
import { ZoomConfig } from '../types';

/**
 * Options for configuring the zoom behavior hook.
 */
export interface UseZoomOptions {
  /** Reference to the SVG element to apply zoom to */
  svgRef: RefObject<SVGSVGElement>;
  /** Reference to the container element for dimension calculations */
  containerRef: RefObject<HTMLDivElement>;
  /** Zoom configuration from theme */
  config: ZoomConfig;
  /** Callback fired when zoom interaction starts */
  onZoomStart?: () => void;
  /** Callback fired during zoom with current transform */
  onZoom?: (transform: ZoomTransform) => void;
  /** Callback fired when zoom interaction ends */
  onZoomEnd?: () => void;
}

/**
 * Return value from the zoom hook providing zoom controls and state.
 */
export interface UseZoomReturn {
  /** The D3 zoom behavior instance, or null if not initialized */
  zoomBehavior: d3.ZoomBehavior<SVGSVGElement, unknown> | null;
  /** Current zoom transform state, or null if not initialized */
  currentTransform: ZoomTransform | null;
  /** Zoom in by one step with smooth transition */
  zoomIn: () => void;
  /** Zoom out by one step with smooth transition */
  zoomOut: () => void;
  /** Reset zoom to identity transform (1:1 scale) */
  resetZoom: () => void;
  /** Set transform programmatically with optional animation */
  setTransform: (transform: ZoomTransform, animate?: boolean) => void;
  /** Pan by dx/dy pixels with optional animation duration */
  panBy: (dx: number, dy: number, duration?: number) => void;
}

/**
 * Custom React hook for D3 zoom behavior with smooth interactions and programmatic controls.
 *
 * This hook encapsulates D3's zoom behavior with the following features:
 * - Smooth wheel zooming with configurable sensitivity
 * - Ctrl+wheel zoom filtering (prevents accidental zooms)
 * - Throttled transform updates for 60fps performance
 * - Programmatic zoom in/out/reset with smooth transitions
 * - Pan functionality with optional animation
 * - User interaction state tracking
 * - Automatic cleanup on unmount
 *
 * @example
 * ```typescript
 * const { zoomIn, zoomOut, resetZoom, currentTransform } = useZoom({
 *   svgRef,
 *   containerRef,
 *   config: theme.zoom,
 *   onZoom: (transform) => console.log('Zoomed:', transform.k)
 * });
 * ```
 *
 * @param options - Configuration object for the hook
 * @returns Object containing zoom behavior, state, and control functions
 */
export function useZoom(options: UseZoomOptions): UseZoomReturn {
  const { svgRef, containerRef, config, onZoomStart, onZoom, onZoomEnd } = options;

  // State
  const [zoomBehavior, setZoomBehavior] = useState<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(
    null,
  );
  const [currentTransform, setCurrentTransform] = useState<ZoomTransform | null>(null);

  // Refs for tracking interaction state
  const isUserInteractingRef = useRef(false);
  const lastTransformTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  /**
   * Throttled transform update to maintain 60fps.
   * Uses requestAnimationFrame for smooth updates.
   */
  const updateTransform = useCallback(
    (transform: ZoomTransform) => {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastTransformTimeRef.current;

      // Throttle to ~60fps (16ms between updates)
      if (timeSinceLastUpdate >= 16) {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
        }

        rafRef.current = requestAnimationFrame(() => {
          setCurrentTransform(transform);
          onZoom?.(transform);
          lastTransformTimeRef.current = now;
          rafRef.current = null;
        });
      }
    },
    [onZoom],
  );

  /**
   * Custom wheel delta calculation for smooth zooming.
   * Applies the wheelDeltaFactor from config for sensitivity control.
   */
  const customWheelDelta = useCallback(
    (event: WheelEvent): number => {
      const mode = event.deltaMode;
      let delta = event.deltaY;

      // Normalize delta based on mode
      if (mode === 1) {
        // DOM_DELTA_LINE
        delta *= 40;
      } else if (mode === 2) {
        // DOM_DELTA_PAGE
        delta *= 800;
      }

      // Apply sensitivity factor and invert sign (deltaY is negative for zoom in)
      return -delta * config.wheelDeltaFactor;
    },
    [config.wheelDeltaFactor],
  );

  /**
   * Initialize D3 zoom behavior with configuration.
   */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Create zoom behavior with scale extent from config
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([config.minScale, config.maxScale])
      .wheelDelta(customWheelDelta)
      .filter((event: Event) => {
        const mouseEvent = event as MouseEvent;
        const wheelEvent = event as WheelEvent;
        // Only allow zoom with Ctrl+wheel or primary mouse button (left click)
        if (event.type === 'wheel') {
          return wheelEvent.ctrlKey || wheelEvent.metaKey;
        }
        // Allow pan with primary button (button 0 = left click)
        if (event.type === 'mousedown') {
          return mouseEvent.button === 0;
        }
        return true;
      })
      .on('start', () => {
        isUserInteractingRef.current = true;
        onZoomStart?.();
      })
      .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        updateTransform(event.transform);
      })
      .on('end', () => {
        isUserInteractingRef.current = false;
        onZoomEnd?.();
      });

    // Apply zoom behavior to SVG
    d3.select(svg).call(zoom);

    // Initialize with identity transform
    const identityTransform = d3.zoomIdentity;
    setCurrentTransform(identityTransform);

    setZoomBehavior(zoom);

    // Cleanup on unmount
    return () => {
      d3.select(svg).on('.zoom', null);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [
    svgRef,
    config.minScale,
    config.maxScale,
    customWheelDelta,
    onZoomStart,
    onZoomEnd,
    updateTransform,
  ]);

  /**
   * Zoom in by one step with smooth transition.
   */
  const zoomIn = useCallback(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !zoomBehavior || !currentTransform || !container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newScale = Math.min(currentTransform.k * (1 + config.step), config.maxScale);

    // Calculate new translation to zoom towards center
    const newTransform = d3.zoomIdentity
      .translate(centerX, centerY)
      .scale(newScale)
      .translate(
        -(centerX - currentTransform.x) / currentTransform.k,
        -(centerY - currentTransform.y) / currentTransform.k,
      );

    // Apply with smooth transition
    d3.select(svg)
      .transition()
      .duration(300 * config.smoothness)
      .call(zoomBehavior.transform, newTransform);
  }, [svgRef, containerRef, zoomBehavior, currentTransform, config]);

  /**
   * Zoom out by one step with smooth transition.
   */
  const zoomOut = useCallback(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !zoomBehavior || !currentTransform || !container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newScale = Math.max(currentTransform.k / (1 + config.step), config.minScale);

    // Calculate new translation to zoom towards center
    const newTransform = d3.zoomIdentity
      .translate(centerX, centerY)
      .scale(newScale)
      .translate(
        -(centerX - currentTransform.x) / currentTransform.k,
        -(centerY - currentTransform.y) / currentTransform.k,
      );

    // Apply with smooth transition
    d3.select(svg)
      .transition()
      .duration(300 * config.smoothness)
      .call(zoomBehavior.transform, newTransform);
  }, [svgRef, containerRef, zoomBehavior, currentTransform, config]);

  /**
   * Reset zoom to identity transform (1:1 scale) with smooth transition.
   */
  const resetZoom = useCallback(() => {
    const svg = svgRef.current;
    if (!svg || !zoomBehavior) return;

    d3.select(svg)
      .transition()
      .duration(500 * config.smoothness)
      .call(zoomBehavior.transform, d3.zoomIdentity);
  }, [svgRef, zoomBehavior, config.smoothness]);

  /**
   * Set transform programmatically with optional animation.
   *
   * @param transform - The target zoom transform
   * @param animate - Whether to animate the transition (default: false)
   */
  const setTransform = useCallback(
    (transform: ZoomTransform, animate = false) => {
      const svg = svgRef.current;
      if (!svg || !zoomBehavior) return;

      if (animate) {
        d3.select(svg)
          .transition()
          .duration(300 * config.smoothness)
          .call(zoomBehavior.transform, transform);
      } else {
        d3.select(svg).call(zoomBehavior.transform, transform);
      }
    },
    [svgRef, zoomBehavior, config.smoothness],
  );

  /**
   * Pan by the specified deltas with optional animation.
   *
   * @param dx - Horizontal pan distance in pixels
   * @param dy - Vertical pan distance in pixels
   * @param duration - Animation duration in milliseconds (default: 0 for instant)
   */
  const panBy = useCallback(
    (dx: number, dy: number, duration = 0) => {
      const svg = svgRef.current;
      if (!svg || !zoomBehavior || !currentTransform) return;

      const newTransform = currentTransform.translate(dx, dy);

      if (duration > 0) {
        d3.select(svg).transition().duration(duration).call(zoomBehavior.transform, newTransform);
      } else {
        d3.select(svg).call(zoomBehavior.transform, newTransform);
      }
    },
    [svgRef, zoomBehavior, currentTransform],
  );

  return {
    zoomBehavior,
    currentTransform,
    zoomIn,
    zoomOut,
    resetZoom,
    setTransform,
    panBy,
  };
}

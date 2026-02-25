# useZoom Hook

A reusable React hook for D3 zoom behavior with smooth interactions and programmatic controls.

## Features

- ✅ Smooth wheel zooming with configurable sensitivity
- ✅ Ctrl+wheel zoom filtering (prevents accidental zooms)
- ✅ Throttled transform updates for 60fps performance
- ✅ Programmatic zoom in/out/reset with smooth transitions
- ✅ Pan functionality with optional animation
- ✅ User interaction state tracking
- ✅ Automatic cleanup on unmount

## Installation

```bash
npm install @workspace/d3-hierarchical-grid
# or
pnpm add @workspace/d3-hierarchical-grid
```

## Basic Usage

```typescript
import { useZoom } from '@workspace/d3-hierarchical-grid';
import { useRef } from 'react';

function MyComponent() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { zoomIn, zoomOut, resetZoom, currentTransform } = useZoom({
    svgRef,
    containerRef,
    config: {
      minScale: 0.1,
      maxScale: 10,
      step: 0.2,
      wheelDeltaFactor: 0.002,
      smoothness: 0.8,
    },
    onZoom: (transform) => {
      console.log('Current scale:', transform.k);
    },
  });

  return (
    <div ref={containerRef}>
      <svg ref={svgRef}>
        <g transform={currentTransform?.toString()}>
          {/* Your SVG content */}
        </g>
      </svg>
      
      <div className="controls">
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
        <button onClick={resetZoom}>Reset</button>
      </div>
    </div>
  );
}
```

## API Reference

### `useZoom(options: UseZoomOptions): UseZoomReturn`

#### Options

```typescript
interface UseZoomOptions {
  svgRef: RefObject<SVGSVGElement>;
  containerRef: RefObject<HTMLDivElement>;
  config: ZoomConfig;
  onZoomStart?: () => void;
  onZoom?: (transform: ZoomTransform) => void;
  onZoomEnd?: () => void;
}
```

| Property | Type | Description |
| -------- | ---- | ----------- |
| `svgRef` | `RefObject<SVGSVGElement>` | Reference to the SVG element to apply zoom to |
| `containerRef` | `RefObject<HTMLDivElement>` | Reference to the container element for dimension calculations |
| `config` | `ZoomConfig` | Zoom configuration (scale limits, sensitivity, etc.) |
| `onZoomStart` | `() => void` | Optional callback fired when zoom interaction starts |
| `onZoom` | `(transform: ZoomTransform) => void` | Optional callback fired during zoom with current transform |
| `onZoomEnd` | `() => void` | Optional callback fired when zoom interaction ends |

#### ZoomConfig

```typescript
interface ZoomConfig {
  minScale: number;        // Minimum zoom scale (e.g., 0.1)
  maxScale: number;        // Maximum zoom scale (e.g., 10)
  step: number;            // Zoom step for controls (e.g., 0.2 = 20% per step)
  wheelDeltaFactor: number; // Mouse wheel sensitivity (e.g., 0.002)
  smoothness: number;      // Transition smoothness 0-1 (e.g., 0.8)
}
```

#### Return Value

```typescript
interface UseZoomReturn {
  zoomBehavior: d3.ZoomBehavior<SVGSVGElement, unknown> | null;
  currentTransform: ZoomTransform | null;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setTransform: (transform: ZoomTransform, animate?: boolean) => void;
  panBy: (dx: number, dy: number, duration?: number) => void;
}
```

| Property | Type | Description |
| -------- | ---- | ----------- |
| `zoomBehavior` | `d3.ZoomBehavior \| null` | The D3 zoom behavior instance |
| `currentTransform` | `ZoomTransform \| null` | Current zoom transform state |
| `zoomIn` | `() => void` | Zoom in by one step with smooth transition |
| `zoomOut` | `() => void` | Zoom out by one step with smooth transition |
| `resetZoom` | `() => void` | Reset zoom to identity transform (1:1 scale) |
| `setTransform` | `(transform, animate?) => void` | Set transform programmatically |
| `panBy` | `(dx, dy, duration?) => void` | Pan by dx/dy pixels |

## Advanced Usage

### With Callbacks

```typescript
const { zoomIn, zoomOut, currentTransform } = useZoom({
  svgRef,
  containerRef,
  config: zoomConfig,
  onZoomStart: () => {
    console.log('Zoom started');
  },
  onZoom: (transform) => {
    // Update UI based on zoom level
    if (transform.k < 0.5) {
      setShowLabels(false);
    } else {
      setShowLabels(true);
    }
  },
  onZoomEnd: () => {
    console.log('Zoom ended');
    saveViewportState(currentTransform);
  },
});
```

### Programmatic Pan and Zoom

```typescript
const { setTransform, panBy } = useZoom({
  svgRef,
  containerRef,
  config: zoomConfig,
});

// Pan to a specific position with animation
const handleGoToItem = (item) => {
  panBy(item.x - 400, item.y - 300, 500); // 500ms animation
};

// Set exact transform
const handleSetView = () => {
  const transform = d3.zoomIdentity
    .translate(100, 100)
    .scale(2);
  setTransform(transform, true); // true = animate
};
```

### Custom Zoom Controls

```typescript
function ZoomControls() {
  const { zoomIn, zoomOut, resetZoom, currentTransform } = useZoom({
    // ... options
  });

  const zoomLevel = currentTransform 
    ? Math.round(currentTransform.k * 100) 
    : 100;

  return (
    <div className="zoom-controls">
      <button onClick={zoomIn} disabled={zoomLevel >= 1000}>+</button>
      <span>{zoomLevel}%</span>
      <button onClick={zoomOut} disabled={zoomLevel <= 10}>-</button>
      <button onClick={resetZoom}>Reset</button>
    </div>
  );
}
```

## Performance Considerations

The hook implements several performance optimizations:

1. **Throttling**: Transform updates are throttled to ~60fps (16ms) to prevent excessive re-renders
2. **requestAnimationFrame**: State updates use RAF for smooth visual updates
3. **Event Filtering**: Only responds to Ctrl+wheel and primary mouse button to prevent conflicts
4. **Cleanup**: Properly removes event listeners on unmount to prevent memory leaks


## Browser Support

Requires browsers with:

- ES6+ support
- D3.js v7+
- React 18+

## Related

- [D3 Zoom Documentation](https://github.com/d3/d3-zoom)
- [ZoomConfig Type Reference](../types.md)

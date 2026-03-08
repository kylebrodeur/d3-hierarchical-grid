# @kylebrodeur/d3-hierarchical-grid

A React + D3 component library for rendering zoomable, pannable hierarchical item grids organized by sections and groups.

## Description

`@kylebrodeur/d3-hierarchical-grid` provides a high-performance SVG grid visualization built with D3.js and React. Items are organized into named groups and sections, with smooth zoom/pan, progressive detail rendering at different zoom levels, and programmatic control via an exposed `GridControls` interface.

### Features

- **D3-powered rendering** — SVG sections, groups, and items rendered via D3 data joins
- **React 18+ compatible** — Functional component with hooks
- **Hierarchical layout** — Auto-organizes items into sections → groups → items
- **Zoom & pan** — Mouse wheel zoom, drag-to-pan, and programmatic `zoomIn`/`zoomOut`/`resetZoom`/`panBy`
- **Progressive detail** — Renders item images/text conditionally based on zoom level
- **TypeScript first** — Full strict-mode types and exported declarations
- **Responsive** — Auto fits content on mount and container resize
- **SSR safe** — Guards against server-side rendering issues

## Installation

```bash
pnpm add @kylebrodeur/d3-hierarchical-grid
# or
npm install @kylebrodeur/d3-hierarchical-grid
```

**Peer Dependencies:**

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `d3` >= 7.0.0

## Basic Usage

```tsx
import { HierarchicalGrid } from '@kylebrodeur/d3-hierarchical-grid';
import type { HierarchyItem, GridControls } from '@kylebrodeur/d3-hierarchical-grid';

const items: HierarchyItem[] = [
  { id: '1', name: 'Item A', group: 'Group 1', section: 'Section A' },
  { id: '2', name: 'Item B', group: 'Group 1', section: 'Section A' },
  { id: '3', name: 'Item C', group: 'Group 2', section: 'Section B' },
];

function App() {
  const [controls, setControls] = useState<GridControls | null>(null);

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <HierarchicalGrid
        items={items}
        onControlsReady={setControls}
        onItemClick={(item) => console.log('Clicked:', item.name)}
      />
      {controls && (
        <div>
          <button onClick={controls.zoomIn}>+</button>
          <button onClick={controls.zoomOut}>-</button>
          <button onClick={controls.resetZoom}>Reset</button>
        </div>
      )}
    </div>
  );
}
```

## API Overview

### `<HierarchicalGrid />`

Main visualization component.

| Prop | Type | Description |
|------|------|-------------|
| `items` | `HierarchyItem[]` | Data items to render |
| `config?` | `GridConfig` | Section/group configuration |
| `theme?` | `Partial<GridTheme>` | Visual theme overrides |
| `selectedItem?` | `HierarchyItem` | Currently selected item (highlighted) |
| `onItemClick?` | `(item: HierarchyItem, pos: ClickPosition) => void` | Item click handler |
| `onItemHover?` | `(item: HierarchyItem \| null) => void` | Item hover handler |
| `onBackgroundClick?` | `(pos: LayoutPosition) => void` | Background click handler |
| `onTransformChange?` | `(transform: ZoomTransform) => void` | Zoom/pan change handler |
| `onControlsReady?` | `(controls: GridControls) => void` | Exposes zoom/pan control methods |
| `onInitialFitComplete?` | `() => void` | Fires after initial fit-to-view |
| `className?` | `string` | Additional CSS class |

### `useZoom(options)`

Custom hook for D3 zoom behavior. Returns `{ zoomIn, zoomOut, resetZoom, setTransform, panBy, currentTransform, zoomBehavior }`.

### `computeLayout(items, config?, theme?)`

Pure function. Computes the full grid layout from `HierarchyItem[]`, returning a `LayoutResult` with positioned sections, groups, items, and bounds.

### Key Types

```typescript
interface HierarchyItem {
  id: string;
  name: string;
  group: string;
  section?: string;
  description?: string;
  imageUrl?: string;
  url?: string;
  metadata?: Record<string, unknown>;
  position?: { x: number | null; y: number | null };
}

interface GridControls {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  fitToView: (options?: FitToViewOptions) => void;
  panBy: (dx: number, dy: number, duration?: number) => void;
  setTransform: (transform: ZoomTransform, animate?: boolean) => void;
  getCurrentTransform: () => ZoomTransform | null;
  clearHighlight: () => void;
}
```

## Development

See [AGENTS.md](./AGENTS.md) for detailed development guidelines and agent integration notes.

```bash
pnpm install       # Install dependencies
pnpm build         # Build to dist/
pnpm test          # Run tests
pnpm typecheck     # Type check
pnpm lint          # Lint
```

## License

MIT © Kyle Brodeur

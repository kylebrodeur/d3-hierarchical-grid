# @workspace/d3-hierarchical-grid

A React component library for rendering hierarchical data structures using D3.js in flexible grid layouts.

## Description

`@workspace/d3-hierarchical-grid` provides a powerful and flexible way to visualize hierarchical data in React applications. It combines the visualization capabilities of D3.js with responsive grid layouts, making it easy to create interactive and scalable hierarchical displays.

### Features

- 🎨 **D3-powered visualizations** - Leverage D3.js for smooth animations and data-driven rendering
- ⚛️ **React 18+ compatible** - Built with modern React patterns and hooks
- 📊 **Hierarchical layouts** - Optimized for nested data structures
- 🎯 **TypeScript first** - Full type safety with comprehensive TypeScript definitions
- 🎪 **Flexible grid system** - Responsive and customizable grid layouts
- ♿ **Accessible** - Built with accessibility in mind

## Installation

```bash
# Using pnpm (recommended for monorepos)
pnpm add @workspace/d3-hierarchical-grid

# Using npm
npm install @workspace/d3-hierarchical-grid

# Using yarn
yarn add @workspace/d3-hierarchical-grid
```

**Peer Dependencies:**

- `react` >= 18.0.0
- `react-dom` >= 18.0.0
- `d3` >= 7.0.0

## Basic Usage

```tsx
import { HierarchicalGrid } from '@workspace/d3-hierarchical-grid'
import type { HierarchicalData } from '@workspace/d3-hierarchical-grid'

const data: HierarchicalData = {
  id: 'root',
  name: 'Root Node',
  children: [
    {
      id: 'child-1',
      name: 'Child 1',
      children: []
    },
    {
      id: 'child-2',
      name: 'Child 2',
      children: []
    }
  ]
}

function App() {
  return (
    <HierarchicalGrid
      data={data}
      width={800}
      height={600}
      onNodeClick={(node) => console.log('Clicked:', node)}
    />
  )
}
```

## API Overview

### Components

#### `<HierarchicalGrid />`

The main component for rendering hierarchical data in a grid layout.

**Props:**

- `data: HierarchicalData` - The hierarchical data structure to visualize
- `width?: number` - Width of the grid (default: 100%)
- `height?: number` - Height of the grid (default: 100%)
- `onNodeClick?: (node: HierarchicalNode) => void` - Callback when a node is clicked
- `onNodeHover?: (node: HierarchicalNode | null) => void` - Callback when a node is hovered
- `theme?: GridTheme` - Custom theme configuration
- `className?: string` - Additional CSS classes

### Types

#### `HierarchicalData`

Represents the structure of hierarchical data.

```typescript
interface HierarchicalData {
  id: string
  name: string
  value?: number
  children?: HierarchicalData[]
  metadata?: Record<string, unknown>
}
```

#### `GridTheme`

Configuration for styling the grid.

```typescript
interface GridTheme {
  nodeColor?: string
  borderColor?: string
  textColor?: string
  backgroundColor?: string
  highlightColor?: string
}
```

## Development

See [AGENTS.md](./AGENTS.md) for detailed development guidelines and agent integration notes.

```bash
# Install dependencies
pnpm install

# Build the package
pnpm run build

# Run tests
pnpm test

# Run type checking
pnpm run typecheck

# Lint code
pnpm run lint
```

## License

MIT © Workspace

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-03-08

### Added

- Initial release
- `HierarchicalGrid` React component for rendering zoomable, pannable hierarchical item grids
- `useZoom` hook for D3 zoom behavior with programmatic controls (`zoomIn`, `zoomOut`, `resetZoom`, `setTransform`, `panBy`)
- `computeLayout` pure function for deterministic layout computation from `HierarchyItem[]`
- Renderer utilities: `renderSections`, `renderGroups`, `renderItems`, `updateItemContent`, `updateHeadingStyles`
- Full TypeScript strict-mode types and exported type declarations
- Comprehensive theme system (`GridTheme`, `SectionStyles`, `GroupStyles`, `ItemStyles`, `ZoomConfig`)
- `GridControls` interface for external zoom/pan control via `onControlsReady` callback
- Progressive detail rendering based on zoom level
- Auto fit-to-view on mount with optional animation
- `onItemClick`, `onItemHover`, `onBackgroundClick`, `onTransformChange` callbacks
- SSR-safe rendering (guards against server-side rendering issues)
- JSDOM-compatible test suite with Vitest

[0.1.0]: https://github.com/kylebrodeur/d3-hierarchical-grid/releases/tag/v0.1.0

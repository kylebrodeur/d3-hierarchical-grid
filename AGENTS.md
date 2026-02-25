# AGENTS.md

## Project Overview

`@workspace/d3-hierarchical-grid` is a React + D3 package for rendering grouped/sectioned hierarchical item data in a zoomable SVG grid.

The package architecture is intentionally split into focused layers:

- `src/components/HierarchicalGrid.tsx`: React orchestration, lifecycle, event wiring, controls exposure
- `src/layout/compute.ts`: pure layout computation from `HierarchyItem[]` + config + theme
- `src/utils/renderer.ts`: D3 section/group/item rendering and zoom-level content updates
- `src/hooks/useZoom.ts`: zoom behavior, transform state, control methods (`zoomIn`, `zoomOut`, `resetZoom`, `setTransform`, `panBy`)
- `src/types.ts`: all public data, theme, and interaction contracts

Primary public exports are available through `src/index.ts`.

## Setup Commands

```bash
# from package root
pnpm install
pnpm build
pnpm test
pnpm lint
pnpm typecheck
```

## Build Commands

```bash
pnpm build        # TypeScript build to dist/
pnpm typecheck    # Strict TS validation without emit
pnpm lint         # ESLint checks
```

## Testing Instructions

```bash
pnpm test
```

Test suite breakdown:

- `tests/layout.test.ts`: pure deterministic layout logic (high-signal unit tests)
- `tests/renderer*.test.ts`: D3 rendering behavior in JSDOM
- `tests/types.test.ts`: type-level/runtime contract checks
- `tests/useZoom.test.ts`, `tests/HierarchicalGrid.test.tsx`: zoom-heavy integration paths with JSDOM limitations

Important testing guidance for agents:

- Prefer **real D3** for renderer/layout tests where possible.
- Avoid deep global mocks of D3 internals unless strictly required.
- Zoom interaction details rely on browser event/model behavior not fully represented by JSDOM; validate end-to-end behavior with `examples/basic` when changing zoom logic.

## Development Notes

- React 18+ functional patterns only.
- Keep layout computation pure and side-effect free.
- Keep D3 DOM mutation inside renderer/hook layers, not in utility types.
- Preserve strict typing at package boundaries (public props/types).
- Follow existing code style in this package (single quotes, semicolons, 2-space indentation).

## Data & Integration Contract

Core input is `HierarchyItem[]` with required fields:

- `id: string`
- `name: string`
- `group: string`
- optional `section`, `description`, `imageUrl`, `url`, `metadata`, `position`

`HierarchicalGrid` integration pattern:

1. Provide `items` (and optional `config`, `theme`, `selectedItem`)
2. Consume callbacks (`onItemClick`, `onItemHover`, `onTransformChange`)
3. Capture controls via `onControlsReady` for external zoom/pan actions

## Agent Skill Location

Package-specific skill docs for AI agents are in:

- `.agent/skills/d3-hierarchical-grid/SKILL.md`

Use that skill as the primary reference when generating integrations, examples, or maintenance changes.

## PR Checklist

- Run `pnpm lint && pnpm typecheck && pnpm build && pnpm test`
- Update tests for behavior changes (especially layout and renderer branches)
- Keep `README.md` and skill docs aligned with any API changes

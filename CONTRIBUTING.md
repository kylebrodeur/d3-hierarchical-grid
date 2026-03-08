# Contributing to @kylebrodeur/d3-hierarchical-grid

Thank you for your interest in contributing! We welcome contributions from the community.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/d3-hierarchical-grid.git
   cd d3-hierarchical-grid
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```

## Development Workflow

### Running Tests

```bash
pnpm test                 # Run tests (run mode)
pnpm test:watch           # Run tests in watch mode
pnpm test:coverage        # Run tests with coverage report
```

### Type Checking

```bash
pnpm typecheck
```

### Linting

```bash
pnpm lint
```

### Building

```bash
pnpm build
```

## Making Changes

1. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
2. **Make your changes**, following the code style guidelines below
3. **Add or update tests** for any new behavior
4. **Run the full check suite** before committing:
   ```bash
   pnpm lint && pnpm typecheck && pnpm build && pnpm test
   ```

## Code Style

- TypeScript strict mode — all changes must type-check
- Single quotes for strings
- Semicolons required (enforced by Prettier)
- 2-space indentation
- Trailing commas in multiline structures
- 100-character line width

## Testing Guidelines

- All tests use Vitest with JSDOM environment
- Tests live in the `tests/` directory
- D3 zoom behavior requires a real browser — keep those tests in `describe.skip` blocks and validate via `examples/basic`
- Do not rely on `requestAnimationFrame` or real zoom events in unit tests

## Architecture Notes

- Keep layout computation pure and side-effect free (`src/layout/compute.ts`)
- Keep D3 DOM mutation inside renderer/hook layers (`src/utils/renderer.ts`, `src/hooks/useZoom.ts`)
- React component orchestration only in `src/components/HierarchicalGrid.tsx`
- All public types exported from `src/types.ts`

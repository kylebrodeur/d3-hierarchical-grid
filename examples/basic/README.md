# HierarchicalGrid Basic Example

This is a basic interactive demo application that showcases the features of the `@workspace/d3-hierarchical-grid` component.

## Features Demonstrated

- **Hierarchical Data Visualization**: Display of ~100 technology items organized into sections and groups
- **Interactive Zoom & Pan**: Smooth zooming with mouse wheel and programmatic controls
- **Item Selection**: Click on items to view detailed information
- **Hover Effects**: Preview item details on hover
- **Custom Theme**: Applied custom styling to sections, groups, and items
- **Control Panel**:
  - Zoom In/Out buttons
  - Reset Zoom
  - Fit to View
- **Live Statistics**: Real-time display of sections, groups, items count, and current zoom level
- **Side Panel**: Dynamic information panel showing selected/hovered item details

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm installed
- The parent workspace must have dependencies installed

### Installation

From the workspace root:

```bash
pnpm install
```

### Running the Demo

Navigate to the example directory:

```bash
cd packages/d3-hierarchical-grid/examples/basic
```

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
pnpm build
```

The built files will be in the `dist/` directory.

## Usage Guide

### Navigation

- **Zoom In/Out**: Use the mouse wheel or the zoom control buttons
- **Pan**: Click and drag on the canvas
- **Select Item**: Click on any item to see its details in the side panel
- **Hover**: Hover over items for a quick preview
- **Clear Selection**: Click on the background or use the "Clear Selection" button
- **Fit to View**: Click the "Fit to View" button to see all content

### Data Structure

The demo uses sample data representing modern technology stacks organized as:

- **4 Sections**: Frontend, Backend, Data & Analytics, Infrastructure
- **20 Groups**: Different technology categories within each section
- **~100 Items**: Individual technologies and tools

## Customization

### Modifying Data

Edit `src/data.ts` to change the hierarchical data structure:

```typescript
export function generateSampleData(): HierarchyItem[] {
  // Modify sections, groups, and items here
}
```

### Changing Theme

Edit the `customTheme` object in `src/App.tsx`:

```typescript
const customTheme: Partial<GridTheme> = {
  section: { /* section styling */ },
  group: { /* group styling */ },
  item: { /* item styling */ },
  zoom: { /* zoom configuration */ },
};
```

### Styling

Modify `src/styles.css` to customize the application layout and controls styling.

## Project Structure

```text
examples/basic/
├── src/
│   ├── App.tsx           # Main application component
│   ├── data.ts           # Sample data generator
│   ├── main.tsx          # Entry point
│   └── styles.css        # Application styles
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── README.md            # This file
```

## Learn More

- [HierarchicalGrid Documentation](../../README.md)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [D3.js Documentation](https://d3js.org/)

## Troubleshooting

### Module resolution errors

Ensure you've run `pnpm install` from the workspace root.

### Component not rendering

Check the browser console for errors. The component requires a valid container with dimensions.

### Performance issues

If you experience lag with large datasets, consider:

- Reducing the number of items
- Adjusting the zoom configuration
- Optimizing custom rendering logic

## License

This example is part of the d3-hierarchical-grid package and follows the same license.

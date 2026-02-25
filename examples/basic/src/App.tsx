import { useState, useCallback } from 'react';
import { HierarchicalGrid } from '../../../src/components/HierarchicalGrid';
import type { GridControls, HierarchyItem, GridTheme } from '../../../src/types';
import { generateSampleData } from './data';

const customTheme: Partial<GridTheme> = {
  section: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderColor: '#3b82f6',
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    gap: 12,
    headerHeight: 40,
  },
  group: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderWidth: 1.5,
    borderRadius: 6,
    padding: 12,
    gap: 8,
    headerHeight: 30,
    minWidth: 200,
  },
  item: {
    width: 120,
    height: 80,
    gap: 8,
    padding: 8,
    backgroundColor: '#f3f4f6',
    hoverBackgroundColor: '#e0e7ff',
    selectedBackgroundColor: '#dbeafe',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 4,
  },
  zoom: {
    minScale: 0.1,
    maxScale: 3,
    step: 0.2,
    wheelDeltaFactor: 0.002,
    smoothness: 0.3,
  },
};

export default function App() {
  const [controls, setControls] = useState<GridControls | null>(null);
  const [selectedItem, setSelectedItem] = useState<HierarchyItem | null>(null);
  const [hoveredItem, setHoveredItem] = useState<HierarchyItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [items] = useState<HierarchyItem[]>(generateSampleData());

  const handleControlsReady = useCallback((newControls: GridControls) => {
    setControls(newControls);
  }, []);

  const handleItemClick = useCallback((item: HierarchyItem) => {
    setSelectedItem(item);
  }, []);

  const handleItemHover = useCallback((item: HierarchyItem | null) => {
    setHoveredItem(item);
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const handleTransformChange = useCallback((transform: { k: number; x: number; y: number }) => {
    setZoomLevel(transform.k);
  }, []);

  const handleFitToView = useCallback(() => {
    if (controls) {
      controls.fitToView({ animate: true, reason: 'manual' });
    }
  }, [controls]);

  const handleZoomIn = useCallback(() => {
    if (controls) {
      controls.zoomIn();
    }
  }, [controls]);

  const handleZoomOut = useCallback(() => {
    if (controls) {
      controls.zoomOut();
    }
  }, [controls]);

  const handleResetZoom = useCallback(() => {
    if (controls) {
      controls.resetZoom();
    }
  }, [controls]);

  const stats = {
    sections: new Set(items.map((item) => item.section)).size,
    groups: new Set(items.map((item) => item.group)).size,
    items: items.length,
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>HierarchicalGrid Demo</h1>
            <p className="subtitle">
              Interactive visualization of {stats.items} technologies across {stats.sections}{' '}
              sections and {stats.groups} groups
            </p>
          </div>
          <div className="stats">
            <div className="stat">
              <div className="stat-value">{stats.sections}</div>
              <div className="stat-label">Sections</div>
            </div>
            <div className="stat">
              <div className="stat-value">{stats.groups}</div>
              <div className="stat-label">Groups</div>
            </div>
            <div className="stat">
              <div className="stat-value">{stats.items}</div>
              <div className="stat-label">Items</div>
            </div>
            <div className="stat">
              <div className="stat-value">{Math.round(zoomLevel * 100)}%</div>
              <div className="stat-label">Zoom</div>
            </div>
          </div>
        </div>
      </header>

      <div className="main-content">
        <aside className="sidebar">
          <div className="controls-panel">
            <h3>Zoom Controls</h3>
            <div className="button-group">
              <button
                onClick={handleZoomIn}
                disabled={!controls}
                className="control-button"
                title="Zoom In"
              >
                <span>🔍+</span>
                <span>Zoom In</span>
              </button>
              <button
                onClick={handleZoomOut}
                disabled={!controls}
                className="control-button"
                title="Zoom Out"
              >
                <span>🔍−</span>
                <span>Zoom Out</span>
              </button>
              <button
                onClick={handleResetZoom}
                disabled={!controls}
                className="control-button"
                title="Reset Zoom"
              >
                <span>↺</span>
                <span>Reset</span>
              </button>
              <button
                onClick={handleFitToView}
                disabled={!controls}
                className="control-button primary"
                title="Fit to View"
              >
                <span>⛶</span>
                <span>Fit to View</span>
              </button>
            </div>
          </div>

          {hoveredItem && !selectedItem && (
            <div className="info-panel">
              <div className="info-header">
                <h3>Hovered Item</h3>
                <span className="info-badge hover">Hover</span>
              </div>
              <div className="info-content">
                <p className="info-name">{hoveredItem.name}</p>
                {hoveredItem.description && (
                  <p className="info-description">{hoveredItem.description}</p>
                )}
                <div className="info-meta">
                  <div className="info-meta-item">
                    <span className="info-meta-label">Group:</span>
                    <span className="info-meta-value">{hoveredItem.group}</span>
                  </div>
                  {hoveredItem.section && (
                    <div className="info-meta-item">
                      <span className="info-meta-label">Section:</span>
                      <span className="info-meta-value">{hoveredItem.section}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedItem && (
            <div className="info-panel">
              <div className="info-header">
                <h3>Selected Item</h3>
                <span className="info-badge selected">Selected</span>
              </div>
              <div className="info-content">
                <p className="info-name">{selectedItem.name}</p>
                {selectedItem.description && (
                  <p className="info-description">{selectedItem.description}</p>
                )}
                <div className="info-meta">
                  <div className="info-meta-item">
                    <span className="info-meta-label">ID:</span>
                    <span className="info-meta-value">{selectedItem.id}</span>
                  </div>
                  <div className="info-meta-item">
                    <span className="info-meta-label">Group:</span>
                    <span className="info-meta-value">{selectedItem.group}</span>
                  </div>
                  {selectedItem.section && (
                    <div className="info-meta-item">
                      <span className="info-meta-label">Section:</span>
                      <span className="info-meta-value">{selectedItem.section}</span>
                    </div>
                  )}
                  {selectedItem.metadata && (
                    <div className="info-meta-item">
                      <span className="info-meta-label">Metadata:</span>
                      <pre className="info-metadata">
                        {JSON.stringify(selectedItem.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
                <button onClick={handleBackgroundClick} className="control-button secondary">
                  Clear Selection
                </button>
              </div>
            </div>
          )}

          {!selectedItem && !hoveredItem && (
            <div className="info-panel placeholder">
              <div className="placeholder-content">
                <span className="placeholder-icon">👆</span>
                <p>Click on an item to see details</p>
                <p className="placeholder-hint">or hover for quick preview</p>
              </div>
            </div>
          )}
        </aside>

        <main className="grid-container">
          <HierarchicalGrid
            items={items}
            selectedItem={selectedItem || undefined}
            theme={customTheme}
            onItemClick={handleItemClick}
            onItemHover={handleItemHover}
            onBackgroundClick={handleBackgroundClick}
            onTransformChange={handleTransformChange}
            onControlsReady={handleControlsReady}
            className="hierarchical-grid"
          />
        </main>
      </div>
    </div>
  );
}

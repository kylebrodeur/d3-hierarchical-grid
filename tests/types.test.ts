/**
 * Test suite for type exports and interfaces
 * Ensures all types are correctly exported and structured
 */

import { describe, it, expect } from 'vitest';
import type {
  HierarchyItem,
  LayoutResult,
  LayoutSection,
  LayoutGroup,
  LayoutItem,
  GridConfig,
  GridTheme,
  SectionStyles,
  GroupStyles,
  ItemStyles,
  ZoomConfig,
} from '../src/types';

describe('Type Exports', () => {
  it('should export HierarchyItem interface', () => {
    const item: HierarchyItem = {
      id: 'test-1',
      name: 'Test Item',
      group: 'test-group',
      section: 'test-section',
    };

    expect(item).toBeDefined();
    expect(item.id).toBe('test-1');
    expect(item.name).toBe('Test Item');
    expect(item.group).toBe('test-group');
    expect(item.section).toBe('test-section');
  });

  it('should support optional HierarchyItem properties', () => {
    const item: HierarchyItem = {
      id: 'test-2',
      name: 'Test Item 2',
      group: 'group-2',
      description: 'A test description',
      imageUrl: 'https://example.com/image.png',
      url: 'https://example.com',
      metadata: { custom: 'value' },
      position: { x: 10, y: 20 },
    };

    expect(item.description).toBe('A test description');
    expect(item.imageUrl).toBe('https://example.com/image.png');
    expect(item.url).toBe('https://example.com');
    expect(item.metadata).toEqual({ custom: 'value' });
    expect(item.position).toEqual({ x: 10, y: 20 });
  });

  it('should export LayoutResult interface', () => {
    const result: LayoutResult = {
      sections: [],
      groups: [],
      items: [],
      bounds: { width: 800, height: 600 },
      stats: { totalSections: 0, totalGroups: 0, totalItems: 0 },
    };

    expect(result).toBeDefined();
    expect(result.bounds).toEqual({ width: 800, height: 600 });
    expect(result.stats).toEqual({ totalSections: 0, totalGroups: 0, totalItems: 0 });
  });

  it('should export LayoutSection interface', () => {
    const section: LayoutSection = {
      id: 'section-1',
      sectionKey: 'key-1',
      x: 0,
      y: 0,
      width: 400,
      height: 300,
      label: 'Section 1',
    };

    expect(section).toBeDefined();
    expect(section.id).toBe('section-1');
    expect(section.sectionKey).toBe('key-1');
    expect(section.label).toBe('Section 1');
  });

  it('should export LayoutGroup interface', () => {
    const group: LayoutGroup = {
      id: 'group-1',
      sectionId: 'section-1',
      sectionKey: 'key-1',
      group: 'Group A',
      x: 10,
      y: 10,
      width: 200,
      height: 150,
      count: 5,
      relativeX: 10,
      relativeY: 10,
    };

    expect(group).toBeDefined();
    expect(group.id).toBe('group-1');
    expect(group.sectionId).toBe('section-1');
    expect(group.count).toBe(5);
  });

  it('should export LayoutItem interface', () => {
    const item: LayoutItem = {
      id: 'item-1',
      itemId: 'data-1',
      sectionKey: 'key-1',
      group: 'Group A',
      groupId: 'group-1',
      x: 20,
      y: 20,
      width: 80,
      height: 100,
      relativeX: 0,
      relativeY: 0,
      dataRef: {
        id: 'data-1',
        name: 'Item 1',
        group: 'Group A',
      },
    };

    expect(item).toBeDefined();
    expect(item.id).toBe('item-1');
    expect(item.itemId).toBe('data-1');
    expect(item.dataRef).toBeDefined();
  });

  it('should export GridConfig interface', () => {
    const config: GridConfig = {
      sections: [{ key: 'section-1', label: 'Section 1', order: 1 }],
      groups: [{ key: 'group-1', label: 'Group 1' }],
    };

    expect(config).toBeDefined();
    expect(config.sections).toHaveLength(1);
    expect(config.groups).toHaveLength(1);
  });

  it('should export GridTheme interface with all style types', () => {
    const theme: GridTheme = {
      section: {
        padding: 16,
        gap: 12,
        headerHeight: 32,
        backgroundColor: '#fff',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 8,
      },
      group: {
        padding: 12,
        gap: 8,
        headerHeight: 28,
        minWidth: 180,
        backgroundColor: '#fafafa',
        borderColor: '#d0d0d0',
        borderWidth: 1,
        borderRadius: 6,
      },
      item: {
        width: 80,
        height: 100,
        gap: 6,
        padding: 8,
        backgroundColor: '#fff',
        hoverBackgroundColor: '#f0f7ff',
        selectedBackgroundColor: '#e3f2fd',
        borderColor: '#c0c0c0',
        borderWidth: 1,
        borderRadius: 4,
      },
      minimap: {
        maxWidth: 200,
        maxHeight: 150,
        backgroundColor: '#fafafa',
        viewportColor: '#2196f3',
        sectionOpacity: 0.6,
      },
      zoom: {
        minScale: 0.3,
        maxScale: 1.5,
        step: 0.2,
        wheelDeltaFactor: 0.002,
        smoothness: 250,
      },
    };

    expect(theme).toBeDefined();
    expect(theme.section.padding).toBe(16);
    expect(theme.group.minWidth).toBe(180);
    expect(theme.item.width).toBe(80);
    expect(theme.zoom.minScale).toBe(0.3);
  });

  it('should export SectionStyles interface', () => {
    const styles: SectionStyles = {
      padding: 16,
      gap: 12,
      headerHeight: 32,
      backgroundColor: '#fff',
      borderColor: '#e0e0e0',
      borderWidth: 1,
      borderRadius: 8,
    };

    expect(styles).toBeDefined();
    expect(styles.padding).toBe(16);
  });

  it('should export GroupStyles interface', () => {
    const styles: GroupStyles = {
      padding: 12,
      gap: 8,
      headerHeight: 28,
      minWidth: 180,
      backgroundColor: '#fafafa',
      borderColor: '#d0d0d0',
      borderWidth: 1,
      borderRadius: 6,
    };

    expect(styles).toBeDefined();
    expect(styles.minWidth).toBe(180);
  });

  it('should export ItemStyles interface', () => {
    const styles: ItemStyles = {
      width: 80,
      height: 100,
      gap: 6,
      padding: 8,
      backgroundColor: '#fff',
      hoverBackgroundColor: '#f0f7ff',
      selectedBackgroundColor: '#e3f2fd',
      borderColor: '#c0c0c0',
      borderWidth: 1,
      borderRadius: 4,
    };

    expect(styles).toBeDefined();
    expect(styles.width).toBe(80);
    expect(styles.height).toBe(100);
  });

  it('should export ZoomConfig interface', () => {
    const config: ZoomConfig = {
      minScale: 0.3,
      maxScale: 1.5,
      step: 0.2,
      wheelDeltaFactor: 0.002,
      smoothness: 250,
    };

    expect(config).toBeDefined();
    expect(config.minScale).toBe(0.3);
    expect(config.maxScale).toBe(1.5);
    expect(config.step).toBe(0.2);
  });
});

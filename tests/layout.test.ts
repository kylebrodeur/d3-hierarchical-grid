/**
 * Test suite for layout computation
 * Tests the computeLayout function from src/layout/compute.ts
 */

import { describe, it, expect } from 'vitest';
import { computeLayout } from '../src/layout/compute';
import type { HierarchyItem, GridConfig } from '../src/types';

describe('computeLayout', () => {
  const mockItems: HierarchyItem[] = [
    { id: '1', name: 'Item 1', group: 'Group A', section: 'Section 1' },
    { id: '2', name: 'Item 2', group: 'Group A', section: 'Section 1' },
    { id: '3', name: 'Item 3', group: 'Group B', section: 'Section 1' },
    { id: '4', name: 'Item 4', group: 'Group C', section: 'Section 2' },
    { id: '5', name: 'Item 5', group: 'Group C', section: 'Section 2' },
  ];

  it('should handle empty items array', () => {
    const result = computeLayout([]);

    expect(result.sections).toHaveLength(0);
    expect(result.groups).toHaveLength(0);
    expect(result.items).toHaveLength(0);
    expect(result.bounds).toEqual({ width: 0, height: 0 });
    expect(result.stats).toEqual({
      totalSections: 0,
      totalGroups: 0,
      totalItems: 0,
    });
  });

  it('should group items by section and group', () => {
    const result = computeLayout(mockItems);

    // Should have 2 sections
    expect(result.sections).toHaveLength(2);
    expect(result.stats.totalSections).toBe(2);

    // Should have 3 groups (2 in section 1, 1 in section 2)
    expect(result.groups).toHaveLength(3);
    expect(result.stats.totalGroups).toBe(3);

    // Should have all 5 items
    expect(result.items).toHaveLength(5);
    expect(result.stats.totalItems).toBe(5);
  });

  it('should calculate correct dimensions', () => {
    const result = computeLayout(mockItems);

    // Check sections have positive dimensions
    result.sections.forEach((section) => {
      expect(section.width).toBeGreaterThan(0);
      expect(section.height).toBeGreaterThan(0);
    });

    // Check groups have positive dimensions
    result.groups.forEach((group) => {
      expect(group.width).toBeGreaterThan(0);
      expect(group.height).toBeGreaterThan(0);
    });

    // Check items have positive dimensions
    result.items.forEach((item) => {
      expect(item.width).toBeGreaterThan(0);
      expect(item.height).toBeGreaterThan(0);
    });

    // Check overall bounds
    expect(result.bounds.width).toBeGreaterThan(0);
    expect(result.bounds.height).toBeGreaterThan(0);
  });

  it('should handle missing sections (auto-detection)', () => {
    const itemsWithoutSection: HierarchyItem[] = [
      { id: '1', name: 'Item 1', group: 'Group A' },
      { id: '2', name: 'Item 2', group: 'Group B' },
    ];

    const result = computeLayout(itemsWithoutSection);

    // Should create a default section
    expect(result.sections).toHaveLength(1);
    expect(result.sections[0].sectionKey).toBe('default');

    // Should have 2 groups
    expect(result.groups).toHaveLength(2);

    // Should have all items
    expect(result.items).toHaveLength(2);
  });

  it('should compute relative positions correctly', () => {
    const result = computeLayout(mockItems);

    // Check that groups have relative positions within their sections
    result.groups.forEach((group) => {
      expect(group.relativeX).toBeGreaterThanOrEqual(0);
      expect(group.relativeY).toBeGreaterThanOrEqual(0);
    });

    // Check that items have relative positions within their groups
    result.items.forEach((item) => {
      expect(item.relativeX).toBeGreaterThanOrEqual(0);
      expect(item.relativeY).toBeGreaterThanOrEqual(0);
    });
  });

  it('should compute absolute positions correctly', () => {
    const result = computeLayout(mockItems);

    // Check that sections have absolute positions
    result.sections.forEach((section) => {
      expect(section.x).toBeGreaterThanOrEqual(0);
      expect(section.y).toBeGreaterThanOrEqual(0);
    });

    // Check that groups have absolute positions
    result.groups.forEach((group) => {
      expect(group.x).toBeGreaterThanOrEqual(0);
      expect(group.y).toBeGreaterThanOrEqual(0);

      // Find parent section
      const parentSection = result.sections.find((s) => s.id === group.sectionId);
      expect(parentSection).toBeDefined();

      // Verify absolute position = section position + relative position
      if (parentSection) {
        expect(group.x).toBeGreaterThanOrEqual(parentSection.x);
        expect(group.y).toBeGreaterThanOrEqual(parentSection.y);
      }
    });

    // Check that items have absolute positions
    result.items.forEach((item) => {
      expect(item.x).toBeGreaterThanOrEqual(0);
      expect(item.y).toBeGreaterThanOrEqual(0);

      // Find parent group
      const parentGroup = result.groups.find((g) => g.id === item.groupId);
      expect(parentGroup).toBeDefined();

      // Verify absolute position is within parent group bounds
      if (parentGroup) {
        expect(item.x).toBeGreaterThanOrEqual(parentGroup.x);
        expect(item.y).toBeGreaterThanOrEqual(parentGroup.y);
      }
    });
  });

  it('should return valid LayoutResult structure', () => {
    const result = computeLayout(mockItems);

    // Verify structure
    expect(result).toHaveProperty('sections');
    expect(result).toHaveProperty('groups');
    expect(result).toHaveProperty('items');
    expect(result).toHaveProperty('bounds');
    expect(result).toHaveProperty('stats');

    // Verify sections
    result.sections.forEach((section) => {
      expect(section).toHaveProperty('id');
      expect(section).toHaveProperty('sectionKey');
      expect(section).toHaveProperty('x');
      expect(section).toHaveProperty('y');
      expect(section).toHaveProperty('width');
      expect(section).toHaveProperty('height');
      expect(section).toHaveProperty('label');
    });

    // Verify groups
    result.groups.forEach((group) => {
      expect(group).toHaveProperty('id');
      expect(group).toHaveProperty('sectionId');
      expect(group).toHaveProperty('sectionKey');
      expect(group).toHaveProperty('group');
      expect(group).toHaveProperty('x');
      expect(group).toHaveProperty('y');
      expect(group).toHaveProperty('width');
      expect(group).toHaveProperty('height');
      expect(group).toHaveProperty('count');
      expect(group).toHaveProperty('relativeX');
      expect(group).toHaveProperty('relativeY');
    });

    // Verify items
    result.items.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('itemId');
      expect(item).toHaveProperty('sectionKey');
      expect(item).toHaveProperty('group');
      expect(item).toHaveProperty('groupId');
      expect(item).toHaveProperty('x');
      expect(item).toHaveProperty('y');
      expect(item).toHaveProperty('width');
      expect(item).toHaveProperty('height');
      expect(item).toHaveProperty('relativeX');
      expect(item).toHaveProperty('relativeY');
      expect(item).toHaveProperty('dataRef');
    });

    // Verify bounds
    expect(result.bounds).toHaveProperty('width');
    expect(result.bounds).toHaveProperty('height');

    // Verify stats
    expect(result.stats).toHaveProperty('totalSections');
    expect(result.stats).toHaveProperty('totalGroups');
    expect(result.stats).toHaveProperty('totalItems');
  });

  it('should respect GridConfig section definitions', () => {
    const config: GridConfig = {
      sections: [
        { key: 'Section 1', label: 'First Section', order: 1 },
        { key: 'Section 2', label: 'Second Section', order: 2 },
      ],
    };

    const result = computeLayout(mockItems, config);

    // Should use config labels
    expect(result.sections[0].label).toBe('First Section');
    expect(result.sections[1].label).toBe('Second Section');
  });

  it('should respect GridConfig group definitions', () => {
    const config: GridConfig = {
      groups: [{ key: 'Group A', label: 'First Group', description: 'A test group' }],
    };

    const result = computeLayout(mockItems, config);

    // Find Group A
    const groupA = result.groups.find((g) => g.group === 'Group A');
    expect(groupA).toBeDefined();
    expect(groupA?.description).toBe('A test group');
  });

  it('should handle single item', () => {
    const singleItem: HierarchyItem[] = [
      { id: '1', name: 'Only Item', group: 'Only Group', section: 'Only Section' },
    ];

    const result = computeLayout(singleItem);

    expect(result.sections).toHaveLength(1);
    expect(result.groups).toHaveLength(1);
    expect(result.items).toHaveLength(1);
    expect(result.stats.totalItems).toBe(1);
  });

  it('should handle many items in one group', () => {
    const manyItems: HierarchyItem[] = Array.from({ length: 20 }, (_, i) => ({
      id: `item-${i}`,
      name: `Item ${i}`,
      group: 'Large Group',
      section: 'Section 1',
    }));

    const result = computeLayout(manyItems);

    expect(result.sections).toHaveLength(1);
    expect(result.groups).toHaveLength(1);
    expect(result.items).toHaveLength(20);
    expect(result.groups[0].count).toBe(20);

    // Group should be large enough to contain all items
    const group = result.groups[0];
    expect(group.height).toBeGreaterThan(100); // Should span multiple rows
  });

  it('should preserve item data reference', () => {
    const result = computeLayout(mockItems);

    result.items.forEach((layoutItem) => {
      const originalItem = mockItems.find((i) => i.id === layoutItem.itemId);
      expect(originalItem).toBeDefined();
      expect(layoutItem.dataRef).toEqual(originalItem);
    });
  });
});

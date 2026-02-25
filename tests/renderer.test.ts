/**
 * Test suite for renderer utilities
 * Tests the rendering functions from src/utils/renderer.ts
 * 
 * Simplified approach: Verify functions work without throwing and return D3 selections.
 * We don't deeply inspect DOM structure created by D3 - that's brittle and unnecessary.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import * as d3 from 'd3';
import { JSDOM } from 'jsdom';
import { renderSections, renderGroups, renderItems } from '../src/utils/renderer';
import type { LayoutSection, LayoutGroup, LayoutItem, HierarchyItem } from '../src/types';
import { DEFAULT_THEME } from '../src/config/defaults';

describe('Renderer Utilities', () => {
  let dom: JSDOM;
  let document: Document;
  let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  beforeEach(() => {
    // Create a fresh JSDOM instance for each test
    dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    document = dom.window.document as unknown as Document;

    // Create SVG element
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(svgElement);

    // Create D3 selection
    svg = d3.select(svgElement);
  });

  describe('renderSections', () => {
    it('should not throw when rendering sections', () => {
      const sections: LayoutSection[] = [
        {
          id: 'section-1',
          sectionKey: 'key-1',
          x: 0,
          y: 0,
          width: 400,
          height: 300,
          label: 'Section 1',
        },
      ];

      const container = svg.append('g').attr('class', 'sections');
      
      expect(() => {
        renderSections(container, sections, DEFAULT_THEME.section);
      }).not.toThrow();
    });

    it('should return a D3 selection', () => {
      const sections: LayoutSection[] = [
        {
          id: 'section-1',
          sectionKey: 'key-1',
          x: 0,
          y: 0,
          width: 400,
          height: 300,
          label: 'Section 1',
        },
      ];

      const container = svg.append('g').attr('class', 'sections');
      const result = renderSections(container, sections, DEFAULT_THEME.section);

      expect(result).toBeDefined();
      expect(typeof result.selectAll).toBe('function');
      expect(typeof result.select).toBe('function');
    });

    it('should handle empty sections array', () => {
      const container = svg.append('g').attr('class', 'sections');
      
      expect(() => {
        renderSections(container, [], DEFAULT_THEME.section);
      }).not.toThrow();
    });

    it('should handle multiple sections', () => {
      const sections: LayoutSection[] = [
        {
          id: 'section-1',
          sectionKey: 'key-1',
          x: 0,
          y: 0,
          width: 400,
          height: 300,
          label: 'Section 1',
        },
        {
          id: 'section-2',
          sectionKey: 'key-2',
          x: 0,
          y: 350,
          width: 400,
          height: 300,
          label: 'Section 2',
        },
      ];

      const container = svg.append('g').attr('class', 'sections');
      
      expect(() => {
        renderSections(container, sections, DEFAULT_THEME.section);
      }).not.toThrow();
    });

    it('should handle updates without throwing', () => {
      const initialSections: LayoutSection[] = [
        {
          id: 'section-1',
          sectionKey: 'key-1',
          x: 0,
          y: 0,
          width: 400,
          height: 300,
          label: 'Section 1',
        },
      ];

      const container = svg.append('g').attr('class', 'sections');
      renderSections(container, initialSections, DEFAULT_THEME.section);

      const updatedSections: LayoutSection[] = [
        {
          id: 'section-1',
          sectionKey: 'key-1',
          x: 10,
          y: 20,
          width: 450,
          height: 350,
          label: 'Updated Section',
        },
      ];

      expect(() => {
        renderSections(container, updatedSections, DEFAULT_THEME.section);
      }).not.toThrow();
    });

    it('should handle sections with different properties', () => {
      const sections: LayoutSection[] = [
        {
          id: 'section-with-long-label',
          sectionKey: 'key-very-long-key',
          x: 100,
          y: 200,
          width: 800,
          height: 600,
          label: 'This is a very long section label that should still work',
        },
      ];

      const container = svg.append('g').attr('class', 'sections');
      
      expect(() => {
        renderSections(container, sections, DEFAULT_THEME.section);
      }).not.toThrow();
    });

    it('should handle zero-sized sections', () => {
      const sections: LayoutSection[] = [
        {
          id: 'section-zero',
          sectionKey: 'key-zero',
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          label: 'Zero Section',
        },
      ];

      const container = svg.append('g').attr('class', 'sections');
      
      expect(() => {
        renderSections(container, sections, DEFAULT_THEME.section);
      }).not.toThrow();
    });

    it('should handle negative positions', () => {
      const sections: LayoutSection[] = [
        {
          id: 'section-negative',
          sectionKey: 'key-negative',
          x: -100,
          y: -50,
          width: 400,
          height: 300,
          label: 'Negative Position',
        },
      ];

      const container = svg.append('g').attr('class', 'sections');
      
      expect(() => {
        renderSections(container, sections, DEFAULT_THEME.section);
      }).not.toThrow();
    });
  });

  describe('renderGroups', () => {
    let sectionSelection: d3.Selection<SVGGElement, LayoutSection, SVGGElement, unknown>;

    beforeEach(() => {
      const sections: LayoutSection[] = [
        {
          id: 'section-1',
          sectionKey: 'key-1',
          x: 0,
          y: 0,
          width: 600,
          height: 400,
          label: 'Section 1',
        },
      ];

      const container = svg.append('g').attr('class', 'sections');
      sectionSelection = renderSections(container, sections, DEFAULT_THEME.section);
    });

    it('should not throw when rendering groups', () => {
      const groups: LayoutGroup[] = [
        {
          id: 'group-1',
          sectionId: 'section-1',
          sectionKey: 'key-1',
          group: 'Group A',
          x: 20,
          y: 50,
          width: 200,
          height: 150,
          count: 3,
          relativeX: 20,
          relativeY: 50,
        },
      ];

      expect(() => {
        renderGroups(sectionSelection, groups, DEFAULT_THEME.group);
      }).not.toThrow();
    });

    it('should return a D3 selection', () => {
      const groups: LayoutGroup[] = [
        {
          id: 'group-1',
          sectionId: 'section-1',
          sectionKey: 'key-1',
          group: 'Group A',
          x: 20,
          y: 50,
          width: 200,
          height: 150,
          count: 3,
          relativeX: 20,
          relativeY: 50,
        },
      ];

      const result = renderGroups(sectionSelection, groups, DEFAULT_THEME.group);

      expect(result).toBeDefined();
      expect(typeof result.selectAll).toBe('function');
      expect(typeof result.select).toBe('function');
    });

    it('should handle empty groups array', () => {
      expect(() => {
        renderGroups(sectionSelection, [], DEFAULT_THEME.group);
      }).not.toThrow();
    });

    it('should handle multiple groups', () => {
      const groups: LayoutGroup[] = [
        {
          id: 'group-1',
          sectionId: 'section-1',
          sectionKey: 'key-1',
          group: 'Group A',
          x: 20,
          y: 50,
          width: 200,
          height: 150,
          count: 3,
          relativeX: 20,
          relativeY: 50,
        },
        {
          id: 'group-2',
          sectionId: 'section-1',
          sectionKey: 'key-1',
          group: 'Group B',
          x: 240,
          y: 50,
          width: 200,
          height: 150,
          count: 2,
          relativeX: 240,
          relativeY: 50,
        },
      ];

      expect(() => {
        renderGroups(sectionSelection, groups, DEFAULT_THEME.group);
      }).not.toThrow();
    });

    it('should handle groups with zero count', () => {
      const groups: LayoutGroup[] = [
        {
          id: 'group-empty',
          sectionId: 'section-1',
          sectionKey: 'key-1',
          group: 'Empty Group',
          x: 20,
          y: 50,
          width: 200,
          height: 150,
          count: 0,
          relativeX: 20,
          relativeY: 50,
        },
      ];

      expect(() => {
        renderGroups(sectionSelection, groups, DEFAULT_THEME.group);
      }).not.toThrow();
    });

    it('should handle groups with large counts', () => {
      const groups: LayoutGroup[] = [
        {
          id: 'group-large',
          sectionId: 'section-1',
          sectionKey: 'key-1',
          group: 'Large Group',
          x: 20,
          y: 50,
          width: 500,
          height: 300,
          count: 100,
          relativeX: 20,
          relativeY: 50,
        },
      ];

      expect(() => {
        renderGroups(sectionSelection, groups, DEFAULT_THEME.group);
      }).not.toThrow();
    });

    it('should handle updates without throwing', () => {
      const initialGroups: LayoutGroup[] = [
        {
          id: 'group-1',
          sectionId: 'section-1',
          sectionKey: 'key-1',
          group: 'Group A',
          x: 20,
          y: 50,
          width: 200,
          height: 150,
          count: 3,
          relativeX: 20,
          relativeY: 50,
        },
      ];

      renderGroups(sectionSelection, initialGroups, DEFAULT_THEME.group);

      const updatedGroups: LayoutGroup[] = [
        {
          id: 'group-1',
          sectionId: 'section-1',
          sectionKey: 'key-1',
          group: 'Updated Group A',
          x: 30,
          y: 60,
          width: 220,
          height: 170,
          count: 5,
          relativeX: 30,
          relativeY: 60,
        },
      ];

      expect(() => {
        renderGroups(sectionSelection, updatedGroups, DEFAULT_THEME.group);
      }).not.toThrow();
    });
  });

  describe('renderItems', () => {
    let groupSelection: d3.Selection<SVGGElement, LayoutGroup, SVGGElement, unknown>;

    beforeEach(() => {
      const sections: LayoutSection[] = [
        {
          id: 'section-1',
          sectionKey: 'key-1',
          x: 0,
          y: 0,
          width: 600,
          height: 400,
          label: 'Section 1',
        },
      ];

      const groups: LayoutGroup[] = [
        {
          id: 'group-1',
          sectionId: 'section-1',
          sectionKey: 'key-1',
          group: 'Group A',
          x: 20,
          y: 50,
          width: 300,
          height: 200,
          count: 2,
          relativeX: 20,
          relativeY: 50,
        },
      ];

      const container = svg.append('g').attr('class', 'sections');
      const sectionSelection = renderSections(container, sections, DEFAULT_THEME.section);
      groupSelection = renderGroups(sectionSelection, groups, DEFAULT_THEME.group);
    });

    it('should not throw when rendering items', () => {
      const dataItem: HierarchyItem = {
        id: 'data-1',
        name: 'Item 1',
        group: 'Group A',
      };

      const items: LayoutItem[] = [
        {
          id: 'item-1',
          itemId: 'data-1',
          sectionKey: 'key-1',
          group: 'Group A',
          groupId: 'group-1',
          x: 30,
          y: 70,
          width: 80,
          height: 100,
          relativeX: 0,
          relativeY: 0,
          dataRef: dataItem,
        },
      ];

      expect(() => {
        renderItems(groupSelection, items, DEFAULT_THEME.item, 1.0);
      }).not.toThrow();
    });

    it('should handle renderOptions as number (zoom level)', () => {
      const items: LayoutItem[] = [
        {
          id: 'item-1',
          itemId: 'data-1',
          sectionKey: 'key-1',
          group: 'Group A',
          groupId: 'group-1',
          x: 30,
          y: 70,
          width: 80,
          height: 100,
          relativeX: 0,
          relativeY: 0,
          dataRef: { id: 'data-1', name: 'Item 1', group: 'Group A' },
        },
      ];

      expect(() => {
        renderItems(groupSelection, items, DEFAULT_THEME.item, 0.5);
      }).not.toThrow();

      expect(() => {
        renderItems(groupSelection, items, DEFAULT_THEME.item, 2.0);
      }).not.toThrow();
    });

    it('should handle renderOptions as object', () => {
      const items: LayoutItem[] = [
        {
          id: 'item-1',
          itemId: 'data-1',
          sectionKey: 'key-1',
          group: 'Group A',
          groupId: 'group-1',
          x: 30,
          y: 70,
          width: 80,
          height: 100,
          relativeX: 0,
          relativeY: 0,
          dataRef: { id: 'data-1', name: 'Item 1', group: 'Group A' },
        },
      ];

      expect(() => {
        renderItems(groupSelection, items, DEFAULT_THEME.item, {
          minZoomForNames: 0.5,
          minZoomForDescriptions: 0.7,
          minZoomForImages: 0.3,
          imageUrlGetter: (item: HierarchyItem) => item.imageUrl || '',
          imageAltGetter: (item: HierarchyItem) => item.name,
        });
      }).not.toThrow();
    });

    it('should handle empty items array', () => {
      expect(() => {
        renderItems(groupSelection, [], DEFAULT_THEME.item, 1.0);
      }).not.toThrow();
    });

    it('should handle multiple items', () => {
      const items: LayoutItem[] = [
        {
          id: 'item-1',
          itemId: 'data-1',
          sectionKey: 'key-1',
          group: 'Group A',
          groupId: 'group-1',
          x: 30,
          y: 70,
          width: 80,
          height: 100,
          relativeX: 0,
          relativeY: 0,
          dataRef: { id: 'data-1', name: 'Item 1', group: 'Group A' },
        },
        {
          id: 'item-2',
          itemId: 'data-2',
          sectionKey: 'key-1',
          group: 'Group A',
          groupId: 'group-1',
          x: 120,
          y: 70,
          width: 80,
          height: 100,
          relativeX: 90,
          relativeY: 0,
          dataRef: { id: 'data-2', name: 'Item 2', group: 'Group A' },
        },
      ];

      expect(() => {
        renderItems(groupSelection, items, DEFAULT_THEME.item, 1.0);
      }).not.toThrow();
    });

    it('should handle items with images', () => {
      const items: LayoutItem[] = [
        {
          id: 'item-1',
          itemId: 'data-1',
          sectionKey: 'key-1',
          group: 'Group A',
          groupId: 'group-1',
          x: 30,
          y: 70,
          width: 80,
          height: 100,
          relativeX: 0,
          relativeY: 0,
          dataRef: {
            id: 'data-1',
            name: 'Item with Image',
            group: 'Group A',
            imageUrl: 'https://example.com/image.png',
          },
        },
      ];

      expect(() => {
        renderItems(groupSelection, items, DEFAULT_THEME.item, {
          minZoomForNames: 0.5,
          minZoomForDescriptions: 0.7,
          minZoomForImages: 0.3,
          imageUrlGetter: (item: HierarchyItem) => item.imageUrl || '',
          imageAltGetter: (item: HierarchyItem) => item.name,
        });
      }).not.toThrow();
    });

    it('should handle items with descriptions', () => {
      const items: LayoutItem[] = [
        {
          id: 'item-1',
          itemId: 'data-1',
          sectionKey: 'key-1',
          group: 'Group A',
          groupId: 'group-1',
          x: 30,
          y: 70,
          width: 80,
          height: 100,
          relativeX: 0,
          relativeY: 0,
          dataRef: {
            id: 'data-1',
            name: 'Item with Description',
            group: 'Group A',
            description: 'This is a detailed description of the item',
          },
        },
      ];

      expect(() => {
        renderItems(groupSelection, items, DEFAULT_THEME.item, 1.0);
      }).not.toThrow();
    });

    it('should handle items with metadata', () => {
      const items: LayoutItem[] = [
        {
          id: 'item-1',
          itemId: 'data-1',
          sectionKey: 'key-1',
          group: 'Group A',
          groupId: 'group-1',
          x: 30,
          y: 70,
          width: 80,
          height: 100,
          relativeX: 0,
          relativeY: 0,
          dataRef: {
            id: 'data-1',
            name: 'Item with Metadata',
            group: 'Group A',
            metadata: { custom: 'value', tags: ['tag1', 'tag2'] },
          },
        },
      ];

      expect(() => {
        renderItems(groupSelection, items, DEFAULT_THEME.item, 1.0);
      }).not.toThrow();
    });

    it('should handle updates without throwing', () => {
      const initialItems: LayoutItem[] = [
        {
          id: 'item-1',
          itemId: 'data-1',
          sectionKey: 'key-1',
          group: 'Group A',
          groupId: 'group-1',
          x: 30,
          y: 70,
          width: 80,
          height: 100,
          relativeX: 0,
          relativeY: 0,
          dataRef: { id: 'data-1', name: 'Item 1', group: 'Group A' },
        },
      ];

      renderItems(groupSelection, initialItems, DEFAULT_THEME.item, 1.0);

      const updatedItems: LayoutItem[] = [
        {
          id: 'item-1',
          itemId: 'data-1',
          sectionKey: 'key-1',
          group: 'Group A',
          groupId: 'group-1',
          x: 40,
          y: 80,
          width: 90,
          height: 110,
          relativeX: 10,
          relativeY: 10,
          dataRef: { id: 'data-1', name: 'Updated Item 1', group: 'Group A' },
        },
      ];

      expect(() => {
        renderItems(groupSelection, updatedItems, DEFAULT_THEME.item, 1.0);
      }).not.toThrow();
    });
  });
});

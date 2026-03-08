import type {
  HierarchyItem,
  GridConfig,
  GridTheme,
  LayoutResult,
  LayoutSection,
  LayoutGroup,
  LayoutItem,
} from '../types';

/**
 * Computes the complete layout for the hierarchical grid.
 * Groups items by section and group, then calculates positions for all elements.
 *
 * This function performs the following steps:
 * 1. Groups items by section (top-level categorization)
 * 2. Within each section, groups items by group (clusters)
 * 3. Calculates dimensions for items, groups, and sections
 * 4. Assigns absolute positions to all elements
 * 5. Returns a complete LayoutResult with all positioned elements
 *
 * @param items - Array of data items to layout
 * @param config - Optional configuration defining sections and groups
 * @param theme - Optional theme with styling that affects layout dimensions
 * @returns Complete layout result with positioned sections, groups, and items
 *
 * @example
 * ```typescript
 * const layout = computeLayout(items, config, theme);
 * console.log(layout.bounds); // { width: 1200, height: 800 }
 * console.log(layout.stats); // { totalSections: 3, totalGroups: 12, totalItems: 48 }
 * ```
 */
export function computeLayout(
  items: HierarchyItem[],
  config?: GridConfig | null,
  theme?: Partial<GridTheme>,
): LayoutResult {
  // Early return for empty data
  if (!items || items.length === 0) {
    return {
      sections: [],
      groups: [],
      items: [],
      bounds: { width: 0, height: 0 },
      stats: { totalSections: 0, totalGroups: 0, totalItems: 0 },
    };
  }

  // Use default dimensions if no theme provided
  const sectionStyles = theme?.section || {
    padding: 16,
    gap: 12,
    headerHeight: 32,
  };
  const groupStyles = theme?.group || {
    padding: 12,
    gap: 8,
    headerHeight: 28,
    minWidth: 180,
  };
  const itemStyles = theme?.item || {
    width: 80,
    height: 100,
    gap: 6,
  };

  // Step 1: Group items by section and group
  const hierarchy = groupItemsHierarchically(items, config);

  // Step 2: Calculate layout for each section
  const sections: LayoutSection[] = [];
  const groups: LayoutGroup[] = [];
  const layoutItems: LayoutItem[] = [];

  let currentY = 0;
  let maxWidth = 0;

  hierarchy.sections.forEach((sectionData, sectionIndex) => {
    const sectionId = `section-${sectionIndex}`;

    // Calculate groups within this section
    const sectionGroups: LayoutGroup[] = [];
    const sectionItems: LayoutItem[] = [];

    let groupY = 0;
    let groupX = 0;
    let rowHeight = 0;
    let rowWidth = sectionStyles.padding;

    sectionData.groups.forEach((groupData, groupIndex) => {
      const groupId = `${sectionId}-group-${groupIndex}`;

      // Calculate items in this group
      const itemsPerRow = Math.floor(
        (groupStyles.minWidth - groupStyles.padding * 2) / (itemStyles.width + itemStyles.gap),
      );
      const rows = Math.ceil(groupData.items.length / itemsPerRow);

      // Calculate group dimensions
      const actualItemsPerRow = Math.min(itemsPerRow, groupData.items.length);
      const groupContentWidth = actualItemsPerRow * (itemStyles.width + itemStyles.gap);
      const groupWidth = Math.max(
        groupStyles.minWidth,
        groupContentWidth + groupStyles.padding * 2,
      );
      const groupContentHeight = rows * (itemStyles.height + itemStyles.gap);
      const groupHeight =
        groupStyles.padding +
        groupStyles.headerHeight +
        groupStyles.gap +
        groupContentHeight +
        groupStyles.padding;

      // Check if group fits in current row, otherwise start new row
      if (groupX > 0 && groupX + groupWidth > maxWidth - sectionStyles.padding) {
        // Move to next row
        groupY += rowHeight + sectionStyles.gap;
        groupX = 0;
        rowHeight = 0;
        rowWidth = sectionStyles.padding;
      }

      // Create group layout
      const layoutGroup: LayoutGroup = {
        id: groupId,
        sectionId,
        sectionKey: sectionData.key,
        group: groupData.key,
        description: groupData.description,
        x: 0, // Will be set later with absolute position
        y: 0, // Will be set later with absolute position
        width: groupWidth,
        height: groupHeight,
        count: groupData.items.length,
        relativeX: sectionStyles.padding + groupX,
        relativeY: sectionStyles.padding + groupStyles.headerHeight + sectionStyles.gap + groupY,
      };

      sectionGroups.push(layoutGroup);

      // Calculate items in this group
      let itemX = 0;
      let itemY = 0;

      groupData.items.forEach((dataItem, itemIndex) => {
        const layoutItem: LayoutItem = {
          id: `${groupId}-item-${itemIndex}`,
          itemId: dataItem.id,
          sectionKey: sectionData.key,
          group: groupData.key,
          groupId,
          x: 0, // Will be set with absolute position
          y: 0, // Will be set with absolute position
          width: itemStyles.width,
          height: itemStyles.height,
          relativeX: itemX,
          relativeY: itemY,
          dataRef: dataItem,
        };

        sectionItems.push(layoutItem);

        // Move to next position
        itemX += itemStyles.width + itemStyles.gap;
        if (itemIndex % itemsPerRow === itemsPerRow - 1) {
          itemX = 0;
          itemY += itemStyles.height + itemStyles.gap;
        }
      });

      // Update row tracking
      groupX += groupWidth + sectionStyles.gap;
      rowHeight = Math.max(rowHeight, groupHeight);
      rowWidth = groupX;
    });

    // Calculate section dimensions
    const sectionContentHeight = groupY + rowHeight;
    const sectionHeight =
      sectionStyles.padding +
      sectionStyles.headerHeight +
      sectionStyles.gap +
      sectionContentHeight +
      sectionStyles.padding;
    const sectionWidth = Math.max(800, rowWidth + sectionStyles.padding); // Minimum section width

    // Create section layout
    const layoutSection: LayoutSection = {
      id: sectionId,
      sectionKey: sectionData.key,
      x: 0,
      y: currentY,
      width: sectionWidth,
      height: sectionHeight,
      label: sectionData.label,
      color: sectionData.color,
    };

    sections.push(layoutSection);

    // Set absolute positions for groups and items in this section
    sectionGroups.forEach((group) => {
      group.x = layoutSection.x + group.relativeX;
      group.y = layoutSection.y + group.relativeY;
      groups.push(group);
    });

    sectionItems.forEach((item) => {
      const parentGroup = sectionGroups.find((g) => g.id === item.groupId);
      if (parentGroup) {
        item.x = parentGroup.x + groupStyles.padding + item.relativeX;
        item.y =
          parentGroup.y +
          groupStyles.padding +
          groupStyles.headerHeight +
          groupStyles.gap +
          item.relativeY;
      }
      layoutItems.push(item);
    });

    // Update tracking for next section
    currentY += sectionHeight + 24; // Section gap
    maxWidth = Math.max(maxWidth, sectionWidth);
  });

  // Return complete layout
  return {
    sections,
    groups,
    items: layoutItems,
    bounds: { width: maxWidth, height: currentY },
    stats: {
      totalSections: sections.length,
      totalGroups: groups.length,
      totalItems: layoutItems.length,
    },
  };
}

/**
 * Groups items hierarchically by section and group.
 * Uses config definitions if available, otherwise infers from data.
 *
 * @param items - Array of data items
 * @param config - Optional configuration with section/group definitions
 * @returns Hierarchical structure with sections containing groups containing items
 */
function groupItemsHierarchically(
  items: HierarchyItem[],
  config?: GridConfig | null,
): {
  sections: Array<{
    key: string;
    label: string;
    color?: string;
    order: number;
    groups: Array<{
      key: string;
      label: string;
      description?: string;
      items: HierarchyItem[];
    }>;
  }>;
} {
  // Build section definitions map
  const sectionDefs = new Map(config?.sections?.map((s) => [s.key, s]) || []);

  // Build group definitions map
  const groupDefs = new Map(config?.groups?.map((g) => [g.key, g]) || []);

  // Group items by section, then by group
  const sectionMap = new Map<string, Map<string, HierarchyItem[]>>();

  items.forEach((item) => {
    const sectionKey = item.section || 'default';
    const groupKey = item.group;

    if (!sectionMap.has(sectionKey)) {
      sectionMap.set(sectionKey, new Map());
    }

    const groupMap = sectionMap.get(sectionKey)!;
    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, []);
    }

    groupMap.get(groupKey)!.push(item);
  });

  // Convert to array structure
  const sections = Array.from(sectionMap.entries()).map(([sectionKey, groupMap]) => {
    const sectionDef = sectionDefs.get(sectionKey);

    const groups = Array.from(groupMap.entries()).map(([groupKey, groupItems]) => {
      const groupDef = groupDefs.get(groupKey);

      return {
        key: groupKey,
        label: groupDef?.label || groupKey,
        description: groupDef?.description,
        items: groupItems,
      };
    });

    // Sort groups alphabetically by label
    groups.sort((a, b) => a.label.localeCompare(b.label));

    return {
      key: sectionKey,
      label: sectionDef?.label || sectionKey,
      color: sectionDef?.color,
      order: sectionDef?.order ?? 999,
      groups,
    };
  });

  // Sort sections by order, then by label
  sections.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.label.localeCompare(b.label);
  });

  return { sections };
}

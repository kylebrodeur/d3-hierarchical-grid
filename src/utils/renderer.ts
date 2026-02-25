import * as d3 from 'd3';
import type {
  LayoutSection,
  LayoutGroup,
  LayoutItem,
  SectionStyles,
  GroupStyles,
  ItemStyles,
  HierarchyItem,
} from '../types';

// ============================================================================
// Section Rendering
// ============================================================================

/**
 * Renders section containers using D3 data joins.
 * Creates SVG groups for each section with proper positioning and styling.
 *
 * @param parentSelection - The parent D3 selection to append sections to
 * @param sections - Array of layout sections to render
 * @param styles - Visual styling configuration for sections
 * @returns D3 selection of section groups bound to section data
 *
 * @example
 * ```typescript
 * const sections = renderSections(svg.select('.sections'), layoutResult.sections, theme.section);
 * ```
 */
export function renderSections(
  parentSelection: d3.Selection<SVGGElement, unknown, null, undefined>,
  sections: LayoutSection[],
  styles: SectionStyles
): d3.Selection<SVGGElement, LayoutSection, SVGGElement, unknown> {
  // Use data join pattern with enter/update/exit
  const sectionSelection = parentSelection
    .selectAll<SVGGElement, LayoutSection>('g.section')
    .data(sections, (d) => d.id);

  // Remove old sections
  sectionSelection.exit().remove();

  // Create new sections
  const sectionEnter = sectionSelection
    .enter()
    .append('g')
    .attr('class', 'section')
    .attr('data-section-id', (d) => d.id)
    .attr('data-section-key', (d) => d.sectionKey);

  // Add background rectangle for each section
  sectionEnter
    .append('rect')
    .attr('class', 'section-background')
    .attr('width', (d) => d.width)
    .attr('height', (d) => d.height)
    .attr('fill', styles.backgroundColor)
    .attr('stroke', styles.borderColor)
    .attr('stroke-width', styles.borderWidth)
    .attr('rx', styles.borderRadius)
    .attr('ry', styles.borderRadius);

  // Add header group for each section
  const headerGroup = sectionEnter
    .append('g')
    .attr('class', 'section-header')
    .attr('transform', `translate(${styles.padding}, ${styles.padding})`);

  // Add header background
  headerGroup
    .append('rect')
    .attr('class', 'section-header-bg')
    .attr('width', (d) => d.width - styles.padding * 2)
    .attr('height', styles.headerHeight)
    .attr('fill', 'transparent');

  // Add header text
  headerGroup
    .append('text')
    .attr('class', 'section-title')
    .attr('x', 8)
    .attr('y', styles.headerHeight / 2)
    .attr('dy', '0.35em')
    .attr('font-size', '16px')
    .attr('font-weight', '600')
    .attr('fill', '#1a1a1a')
    .text((d) => d.label);

  // Add content container for groups
  sectionEnter
    .append('g')
    .attr('class', 'section-content')
    .attr(
      'transform',
      `translate(${styles.padding}, ${styles.padding + styles.headerHeight + styles.gap})`
    );

  // Merge enter and update selections
  const sectionMerge = sectionEnter.merge(sectionSelection);

  // Update positions using absolute coordinates
  sectionMerge.attr('transform', (d) => `translate(${d.x}, ${d.y})`);

  // Update background dimensions
  sectionMerge
    .select<SVGRectElement>('rect.section-background')
    .attr('width', (d) => d.width)
    .attr('height', (d) => d.height)
    .attr('fill', styles.backgroundColor)
    .attr('stroke', styles.borderColor)
    .attr('stroke-width', styles.borderWidth);

  // Update header text
  sectionMerge.select<SVGTextElement>('text.section-title').text((d) => d.label);

  // Update header background width
  sectionMerge
    .select<SVGRectElement>('rect.section-header-bg')
    .attr('width', (d) => d.width - styles.padding * 2);

  return sectionMerge;
}

// ============================================================================
// Group Rendering
// ============================================================================

/**
 * Renders group containers within sections using D3 data joins.
 * Creates nested SVG groups for each cluster with relative positioning.
 *
 * @param sectionSelection - D3 selection of section groups
 * @param groups - Array of layout groups to render
 * @param styles - Visual styling configuration for groups
 * @returns D3 selection of group elements bound to group data
 *
 * @example
 * ```typescript
 * const groups = renderGroups(sectionSelection, layoutResult.groups, theme.group);
 * ```
 */
export function renderGroups(
  sectionSelection: d3.Selection<SVGGElement, LayoutSection, SVGGElement, unknown>,
  groups: LayoutGroup[],
  styles: GroupStyles
): d3.Selection<SVGGElement, LayoutGroup, SVGGElement, unknown> {
  // For each section, bind groups that belong to it
  const groupSelection = sectionSelection
    .select<SVGGElement>('g.section-content')
    .selectAll<SVGGElement, LayoutGroup>('g.group')
    .data(
      (sectionData) => groups.filter((g) => g.sectionId === sectionData.id),
      (d) => d.id
    );

  // Remove old groups
  groupSelection.exit().remove();

  // Create new groups
  const groupEnter = groupSelection
    .enter()
    .append('g')
    .attr('class', 'group')
    .attr('data-group-id', (d) => d.id)
    .attr('data-group-key', (d) => d.group);

  // Add background rectangle for each group
  groupEnter
    .append('rect')
    .attr('class', 'group-background')
    .attr('width', (d) => d.width)
    .attr('height', (d) => d.height)
    .attr('fill', styles.backgroundColor)
    .attr('stroke', styles.borderColor)
    .attr('stroke-width', styles.borderWidth)
    .attr('rx', styles.borderRadius)
    .attr('ry', styles.borderRadius);

  // Add header group for each group
  const headerGroup = groupEnter
    .append('g')
    .attr('class', 'group-header')
    .attr('transform', `translate(${styles.padding}, ${styles.padding})`);

  // Add header background
  headerGroup
    .append('rect')
    .attr('class', 'group-header-bg')
    .attr('width', (d) => d.width - styles.padding * 2)
    .attr('height', styles.headerHeight)
    .attr('fill', 'transparent');

  // Add header text
  headerGroup
    .append('text')
    .attr('class', 'group-title')
    .attr('x', 6)
    .attr('y', styles.headerHeight / 2)
    .attr('dy', '0.35em')
    .attr('font-size', '14px')
    .attr('font-weight', '500')
    .attr('fill', '#2a2a2a')
    .text((d) => d.group);

  // Add item count badge
  headerGroup
    .append('text')
    .attr('class', 'group-count')
    .attr('x', (d) => d.width - styles.padding * 2 - 8)
    .attr('y', styles.headerHeight / 2)
    .attr('dy', '0.35em')
    .attr('font-size', '12px')
    .attr('font-weight', '400')
    .attr('fill', '#666')
    .attr('text-anchor', 'end')
    .text((d) => `${d.count}`);

  // Add content container for items
  groupEnter
    .append('g')
    .attr('class', 'group-content')
    .attr(
      'transform',
      `translate(${styles.padding}, ${styles.padding + styles.headerHeight + styles.gap})`
    );

  // Merge enter and update selections
  const groupMerge = groupEnter.merge(groupSelection);

  // Update positions using relative coordinates within section
  groupMerge.attr('transform', (d) => `translate(${d.relativeX}, ${d.relativeY})`);

  // Update background dimensions
  groupMerge
    .select<SVGRectElement>('rect.group-background')
    .attr('width', (d) => d.width)
    .attr('height', (d) => d.height)
    .attr('fill', styles.backgroundColor)
    .attr('stroke', styles.borderColor)
    .attr('stroke-width', styles.borderWidth);

  // Update header text
  groupMerge.select<SVGTextElement>('text.group-title').text((d) => d.group);

  // Update count
  groupMerge
    .select<SVGTextElement>('text.group-count')
    .attr('x', (d) => d.width - styles.padding * 2 - 8)
    .text((d) => `${d.count}`);

  // Update header background width
  groupMerge
    .select<SVGRectElement>('rect.group-header-bg')
    .attr('width', (d) => d.width - styles.padding * 2);

  return groupMerge;
}

// ============================================================================
// Item Rendering
// ============================================================================

/**
 * Renders individual items within groups using D3 data joins.
 * Creates interactive item cards with hover and click handlers.
 *
 * @param groupSelection - D3 selection of group elements
 * @param items - Array of layout items to render
 * @param styles - Visual styling configuration for items
 * @param zoomLevel - Current zoom scale for conditional rendering
 * @returns D3 selection of item elements bound to item data
 *
 * @example
 * ```typescript
 * const items = renderItems(groupSelection, layoutResult.items, theme.item, 1.0);
 * items.on('click', (event, d) => onItemClick(d.dataRef));
 * ```
 */
export function renderItems(
  groupSelection: d3.Selection<SVGGElement, LayoutGroup, SVGGElement, unknown>,
  items: LayoutItem[],
  styles: ItemStyles,
  _zoomLevel: number
): d3.Selection<SVGGElement, LayoutItem, SVGGElement, unknown> {
  // For each group, bind items that belong to it
  const itemSelection = groupSelection
    .select<SVGGElement>('g.group-content')
    .selectAll<SVGGElement, LayoutItem>('g.item')
    .data(
      (groupData) => items.filter((item) => item.groupId === groupData.id),
      (d) => d.id
    );

  // Remove old items
  itemSelection.exit().remove();

  // Create new items
  const itemEnter = itemSelection
    .enter()
    .append('g')
    .attr('class', 'item')
    .attr('data-item-id', (d) => d.itemId)
    .attr('data-group-id', (d) => d.groupId)
    .style('cursor', 'pointer');

  // Add background rectangle for each item
  itemEnter
    .append('rect')
    .attr('class', 'item-background')
    .attr('width', styles.width)
    .attr('height', styles.height)
    .attr('fill', styles.backgroundColor)
    .attr('stroke', styles.borderColor)
    .attr('stroke-width', styles.borderWidth)
    .attr('rx', styles.borderRadius)
    .attr('ry', styles.borderRadius);

  // Add image container (circle for avatars/icons)
  itemEnter
    .append('circle')
    .attr('class', 'item-image')
    .attr('cx', styles.width / 2)
    .attr('cy', styles.height * 0.35)
    .attr('r', Math.min(styles.width, styles.height) * 0.2)
    .attr('fill', '#e0e0e0')
    .attr('stroke', '#ccc')
    .attr('stroke-width', 1);

  // Add initials text (fallback when no image)
  itemEnter
    .append('text')
    .attr('class', 'item-initials')
    .attr('x', styles.width / 2)
    .attr('y', styles.height * 0.35)
    .attr('dy', '0.35em')
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', '600')
    .attr('fill', '#666')
    .attr('pointer-events', 'none');

  // Add name text
  itemEnter
    .append('text')
    .attr('class', 'item-name')
    .attr('x', styles.width / 2)
    .attr('y', styles.height * 0.65)
    .attr('text-anchor', 'middle')
    .attr('font-size', '11px')
    .attr('font-weight', '400')
    .attr('fill', '#1a1a1a')
    .attr('pointer-events', 'none')
    .style('user-select', 'none')
    .each(function (d) {
      // Truncate long names
      const text = d3.select(this);
      const name = d.dataRef.name;
      const maxLength = 20;
      text.text(name.length > maxLength ? name.slice(0, maxLength) + '...' : name);
    });

  // Add selection indicator (hidden by default)
  itemEnter
    .append('rect')
    .attr('class', 'item-selection-ring')
    .attr('x', -2)
    .attr('y', -2)
    .attr('width', styles.width + 4)
    .attr('height', styles.height + 4)
    .attr('fill', 'none')
    .attr('stroke', styles.selectedBackgroundColor)
    .attr('stroke-width', 3)
    .attr('rx', styles.borderRadius + 2)
    .attr('ry', styles.borderRadius + 2)
    .attr('opacity', 0)
    .attr('pointer-events', 'none');

  // Merge enter and update selections
  const itemMerge = itemEnter.merge(itemSelection);

  // Update positions using relative coordinates within group
  itemMerge.attr('transform', (d) => `translate(${d.relativeX}, ${d.relativeY})`);

  // Update background with hover effects
  itemMerge
    .select<SVGRectElement>('rect.item-background')
    .attr('width', styles.width)
    .attr('height', styles.height)
    .attr('fill', styles.backgroundColor)
    .attr('stroke', styles.borderColor)
    .attr('stroke-width', styles.borderWidth);

  // Update name text
  itemMerge.select<SVGTextElement>('text.item-name').each(function (d) {
    const text = d3.select(this);
    const name = d.dataRef.name;
    const maxLength = 20;
    text.text(name.length > maxLength ? name.slice(0, maxLength) + '...' : name);
  });

  // Add hover interactions
  itemMerge
    .on('mouseenter', function () {
      d3.select(this)
        .select<SVGRectElement>('rect.item-background')
        .attr('fill', styles.hoverBackgroundColor);
    })
    .on('mouseleave', function () {
      d3.select(this)
        .select<SVGRectElement>('rect.item-background')
        .attr('fill', styles.backgroundColor);
    });

  return itemMerge;
}

// ============================================================================
// Item Content Updates
// ============================================================================

/**
 * Updates item content based on zoom level for progressive detail rendering.
 * Conditionally shows/hides images, initials, and text based on zoom scale.
 *
 * @param itemSelection - D3 selection of item elements
 * @param zoomLevel - Current zoom scale (1.0 = 100%)
 * @param styles - Visual styling configuration for items
 * @param options - Optional configuration for content retrieval
 * @param options.imageUrlGetter - Function to extract image URL from item data
 * @param options.initialsGetter - Function to generate initials from item data
 *
 * @example
 * ```typescript
 * updateItemContent(
 *   itemSelection,
 *   transform.k,
 *   theme.item,
 *   {
 *     imageUrlGetter: (item) => item.imageUrl || '',
 *     initialsGetter: (item) => item.name.slice(0, 2).toUpperCase()
 *   }
 * );
 * ```
 */
export function updateItemContent(
  itemSelection: d3.Selection<SVGGElement, LayoutItem, SVGGElement, unknown>,
  zoomLevel: number,
  _styles: ItemStyles,
  options?: {
    imageUrlGetter?: (item: HierarchyItem) => string;
    initialsGetter?: (item: HierarchyItem) => string;
  }
): void {
  const { imageUrlGetter, initialsGetter } = options || {};

  // Define zoom thresholds for progressive rendering
  const SHOW_INITIALS_THRESHOLD = 0.5;
  const SHOW_NAMES_THRESHOLD = 0.7;
  const SHOW_IMAGES_THRESHOLD = 0.8;

  // Update image visibility and content
  itemSelection.select<SVGCircleElement>('circle.item-image').style('opacity', () => {
    return zoomLevel >= SHOW_IMAGES_THRESHOLD ? 1 : 0;
  });

  // Update initials visibility
  itemSelection
    .select<SVGTextElement>('text.item-initials')
    .style('opacity', (d) => {
      if (zoomLevel < SHOW_INITIALS_THRESHOLD) return 0;
      // Hide initials if we have an image and zoom is high enough
      const hasImage = imageUrlGetter ? !!imageUrlGetter(d.dataRef) : !!d.dataRef.imageUrl;
      if (hasImage && zoomLevel >= SHOW_IMAGES_THRESHOLD) return 0;
      return 1;
    })
    .text((d) => {
      if (initialsGetter) return initialsGetter(d.dataRef);
      // Default: first two letters of name
      return d.dataRef.name.slice(0, 2).toUpperCase();
    });

  // Update name text visibility
  itemSelection
    .select<SVGTextElement>('text.item-name')
    .style('opacity', () => {
      return zoomLevel >= SHOW_NAMES_THRESHOLD ? 1 : 0;
    })
    .attr('font-size', () => {
      // Scale font size with zoom for better readability
      if (zoomLevel < 0.8) return '9px';
      if (zoomLevel < 1.2) return '11px';
      return '12px';
    });

  // Update image background patterns or clipPath if image URLs are provided
  if (imageUrlGetter) {
    itemSelection.each(function (d) {
      const imageUrl = imageUrlGetter(d.dataRef);
      if (imageUrl && zoomLevel >= SHOW_IMAGES_THRESHOLD) {
        const circle = d3.select(this).select<SVGCircleElement>('circle.item-image');
        // Create a pattern for the image (simplified; in production use defs)
        circle.attr('fill', '#e0e0e0'); // Placeholder until image pattern is set up
        // Note: Full image pattern implementation requires creating <defs> and <pattern>
        // This is a simplified version focusing on the structure
      }
    });
  }
}

// ============================================================================
// Typography Updates
// ============================================================================

/**
 * Updates heading typography (section and group titles) based on zoom level.
 * Dynamically adjusts font sizes and weights for better readability at different scales.
 *
 * @param svg - Root SVG selection containing all elements
 * @param zoomLevel - Current zoom scale (1.0 = 100%)
 * @param config - Configuration for typography thresholds and values
 * @param config.thresholds - Array of zoom thresholds (e.g., [0.5, 0.8, 1.0, 1.5])
 * @param config.fontSizes - Font size values for sections and groups at each threshold
 * @param config.fontWeights - Font weight values for sections and groups at each threshold
 *
 * @example
 * ```typescript
 * updateHeadingStyles(svg, transform.k, {
 *   thresholds: [0.5, 0.8, 1.0, 1.5],
 *   fontSizes: {
 *     sections: [12, 14, 16, 18],
 *     groups: [10, 12, 14, 16]
 *   },
 *   fontWeights: {
 *     sections: ['500', '600', '600', '700'],
 *     groups: ['400', '500', '500', '600']
 *   }
 * });
 * ```
 */
export function updateHeadingStyles(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  zoomLevel: number,
  config: {
    thresholds: number[];
    fontSizes: { sections: number[]; groups: number[] };
    fontWeights: { sections: string[]; groups: string[] };
  }
): void {
  const { thresholds, fontSizes, fontWeights } = config;

  // Find the appropriate threshold index
  let thresholdIndex = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (zoomLevel >= thresholds[i]) {
      thresholdIndex = i;
    } else {
      break;
    }
  }

  // Ensure index is within bounds
  thresholdIndex = Math.min(thresholdIndex, fontSizes.sections.length - 1);

  // Update section titles
  svg
    .selectAll<SVGTextElement, unknown>('text.section-title')
    .attr('font-size', `${fontSizes.sections[thresholdIndex]}px`)
    .attr('font-weight', fontWeights.sections[thresholdIndex])
    .style('opacity', () => {
      // Hide section titles at very low zoom levels
      return zoomLevel < 0.4 ? 0 : 1;
    });

  // Update group titles
  svg
    .selectAll<SVGTextElement, unknown>('text.group-title')
    .attr('font-size', `${fontSizes.groups[thresholdIndex]}px`)
    .attr('font-weight', fontWeights.groups[thresholdIndex])
    .style('opacity', () => {
      // Hide group titles at very low zoom levels
      return zoomLevel < 0.5 ? 0 : 1;
    });

  // Update group counts (scale slightly smaller)
  svg
    .selectAll<SVGTextElement, unknown>('text.group-count')
    .attr('font-size', `${Math.max(10, fontSizes.groups[thresholdIndex] - 2)}px`)
    .style('opacity', () => {
      // Hide counts at low zoom levels
      return zoomLevel < 0.6 ? 0 : 1;
    });
}

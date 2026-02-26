// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from '../interfaces';

export interface OptionWithVisibility extends CollectionPreferencesProps.ContentDisplayOption {
  visible: boolean;
}

/**
 * A group header node in the hierarchical tree, containing ordered leaf column children.
 */
export interface OptionGroupNode {
  id: string;
  label: string;
  groupId?: string; // For nested groups (group-of-groups)
  isGroup: true;
  children: OptionWithVisibility[];
}

/** A flat leaf column node (not a group header). */
export interface OptionLeafNode extends OptionWithVisibility {
  isGroup: false;
}

/** A node in the top-level option tree — either a group header or a standalone leaf column. */
export type OptionTreeNode = OptionGroupNode | OptionLeafNode;

export function getSortedOptions({
  options,
  contentDisplay,
}: {
  options: ReadonlyArray<CollectionPreferencesProps.ContentDisplayOption>;
  contentDisplay: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>;
}): ReadonlyArray<OptionWithVisibility> {
  // By using a Map, we are guaranteed to preserve insertion order on future iteration.
  const optionsById = new Map<string, OptionWithVisibility>();
  // We insert contentDisplay first so we respect the currently selected order
  for (const { id, visible } of contentDisplay) {
    // If an option is provided in contentDisplay and not options, we default the label to the id
    optionsById.set(id, { id, label: id, visible });
  }
  // We merge options data, and insert any that were not in contentDisplay as non-visible
  for (const option of options) {
    const existing = optionsById.get(option.id);
    optionsById.set(option.id, { ...option, visible: !!existing?.visible });
  }
  return Array.from(optionsById.values());
}

/**
 * Builds the top-level tree of option nodes from the sorted flat options and group definitions.
 *
 * Each group collects its leaf children in sorted order. Ungrouped leaf columns appear
 * at the top level between groups, preserving overall column order.
 *
 * The order of top-level nodes is determined by the first appearance of each group/column
 * in the sorted options list.
 */
export function buildOptionTree(
  sortedOptions: ReadonlyArray<OptionWithVisibility>,
  groups: ReadonlyArray<CollectionPreferencesProps.ContentDisplayOptionGroup>
): OptionTreeNode[] {
  if (!groups || groups.length === 0) {
    return sortedOptions.map(opt => ({ ...opt, isGroup: false as const }));
  }

  // Map group id -> group definition
  const groupById = new Map<string, CollectionPreferencesProps.ContentDisplayOptionGroup>();
  for (const group of groups) {
    groupById.set(group.id, group);
  }

  // Accumulate children per group, in the order options appear
  const groupChildren = new Map<string, OptionWithVisibility[]>();
  for (const group of groups) {
    groupChildren.set(group.id, []);
  }

  // Track the insertion order of top-level nodes using a key: groupId or `leaf:${id}`
  const topLevelOrder: string[] = [];
  const seenTopLevel = new Set<string>();

  for (const option of sortedOptions) {
    const gid = option.groupId;
    if (gid && groupById.has(gid)) {
      // This option belongs to a group — add to that group's children
      groupChildren.get(gid)!.push(option);
      // Register the group as a top-level entry the first time we see one of its children
      if (!seenTopLevel.has(gid)) {
        seenTopLevel.add(gid);
        topLevelOrder.push(gid);
      }
    } else {
      // Ungrouped leaf column — top-level entry
      const key = `leaf:${option.id}`;
      if (!seenTopLevel.has(key)) {
        seenTopLevel.add(key);
        topLevelOrder.push(key);
      }
    }
  }

  // Build result in top-level order
  const result: OptionTreeNode[] = [];
  // Keep a map from leaf-key to its option for fast lookup
  const optionByLeafKey = new Map<string, OptionWithVisibility>();
  for (const opt of sortedOptions) {
    optionByLeafKey.set(`leaf:${opt.id}`, opt);
  }

  for (const key of topLevelOrder) {
    if (key.startsWith('leaf:')) {
      const opt = optionByLeafKey.get(key)!;
      result.push({ ...opt, isGroup: false as const });
    } else {
      const group = groupById.get(key)!;
      result.push({
        id: group.id,
        label: group.label,
        groupId: group.groupId,
        isGroup: true as const,
        children: groupChildren.get(key)!,
      });
    }
  }

  return result;
}

/**
 * Flattens a tree of OptionTreeNodes back to a flat ContentDisplayItem array,
 * depth-first: group's children immediately follow the group node.
 * Group headers themselves are NOT emitted — only leaf columns.
 */
export function flattenOptionTree(
  tree: OptionTreeNode[]
): ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem> {
  const result: CollectionPreferencesProps.ContentDisplayItem[] = [];
  for (const node of tree) {
    if (node.isGroup) {
      for (const child of node.children) {
        result.push({ id: child.id, visible: child.visible });
      }
    } else {
      result.push({ id: node.id, visible: node.visible });
    }
  }
  return result;
}

export function getFilteredOptions(options: ReadonlyArray<OptionWithVisibility>, filterText: string) {
  filterText = filterText.trim().toLowerCase();

  if (!filterText) {
    return options;
  }

  return options.filter(option => option.label.toLowerCase().trim().includes(filterText));
}

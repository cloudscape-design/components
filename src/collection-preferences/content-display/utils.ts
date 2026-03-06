// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from '../interfaces';

export interface OptionWithVisibility extends CollectionPreferencesProps.ContentDisplayOption {
  visible: boolean;
}

/**
 * A group header node in the hierarchical tree.
 * children can be either nested sub-group nodes OR leaf column nodes — supporting N-level nesting.
 */
export interface OptionGroupNode {
  id: string;
  label: string;
  groupId?: string;
  isGroup: true;
  children: OptionTreeNode[];
}

/** A flat leaf column node (not a group header). */
export interface OptionLeafNode extends OptionWithVisibility {
  isGroup: false;
}

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

export function buildOptionTree(
  sortedOptions: ReadonlyArray<OptionWithVisibility>,
  groups: ReadonlyArray<CollectionPreferencesProps.ContentDisplayOptionGroup>
): OptionTreeNode[] {
  if (!groups || groups.length === 0) {
    return sortedOptions.map(opt => ({ ...opt, isGroup: false as const }));
  }

  // Map group id → group definition
  const groupById = new Map<string, CollectionPreferencesProps.ContentDisplayOptionGroup>();
  for (const group of groups) {
    groupById.set(group.id, group);
  }

  // insertion-order tracking so we preserve the sorted options order.
  const childrenMap = new Map<string | null, OptionTreeNode[]>();
  childrenMap.set(null, []); // null = root level
  for (const group of groups) {
    childrenMap.set(group.id, []);
  }

  // Track which node IDs have already been placed to avoid duplicates
  const placed = new Set<string>();

  /**
   * Resolve the effective parent for a node:
   * - If node.groupId exists and that group exists → parent is that group
   * - Otherwise → parent is root (null)
   */
  const resolveParent = (groupId: string | undefined): string | null => {
    if (groupId && groupById.has(groupId)) {
      return groupId;
    }
    return null;
  };

  /**
   * Find the earliest leaf option index that is a descendant of a given group.
   * Used to determine insertion order of groups relative to their sibling leaf columns.
   */
  const firstLeafIndex = new Map<string, number>();
  // Pre-compute for each leaf option its index in sortedOptions
  const optionIndex = new Map<string, number>();
  sortedOptions.forEach((opt, i) => optionIndex.set(opt.id, i));

  // For each group, find the minimum index among its direct and indirect leaf descendants
  const computeFirstLeafIndex = (groupId: string): number => {
    if (firstLeafIndex.has(groupId)) {
      return firstLeafIndex.get(groupId)!;
    }
    let min = Infinity;
    // Direct leaf children
    for (const opt of sortedOptions) {
      if (opt.groupId === groupId) {
        const idx = optionIndex.get(opt.id) ?? Infinity;
        if (idx < min) {
          min = idx;
        }
      }
    }
    // Indirect children via sub-groups
    for (const group of groups) {
      if (group.groupId === groupId) {
        const sub = computeFirstLeafIndex(group.id);
        if (sub < min) {
          min = sub;
        }
      }
    }
    firstLeafIndex.set(groupId, min);
    return min;
  };
  for (const group of groups) {
    computeFirstLeafIndex(group.id);
  }

  // We build children lists by processing sortedOptions (leaf columns) in order,
  // and inserting group nodes at the position of their first leaf descendant.
  // We use an insertion-order approach: for each parent, track which children
  // have been added and in what order.

  const parentOrder = new Map<string | null, string[]>(); // parent → ordered child IDs
  const parentOrderSet = new Map<string | null, Set<string>>(); // for O(1) membership
  parentOrder.set(null, []);
  parentOrderSet.set(null, new Set());
  for (const group of groups) {
    parentOrder.set(group.id, []);
    parentOrderSet.set(group.id, new Set());
  }

  const ensureAncestorsPlaced = (groupId: string) => {
    // Walk up the ancestor chain and ensure each ancestor is registered with its parent
    const chain: string[] = [];
    let current: string | undefined = groupId;
    while (current) {
      chain.unshift(current);
      const parentGroupId: string | undefined = groupById.get(current)?.groupId;
      if (!parentGroupId || !groupById.has(parentGroupId)) {
        break;
      }
      current = parentGroupId;
    }
    // Now place from top down
    for (const gid of chain) {
      const parentId = resolveParent(groupById.get(gid)?.groupId);
      const order = parentOrder.get(parentId)!;
      const orderSet = parentOrderSet.get(parentId)!;
      if (!orderSet.has(gid)) {
        orderSet.add(gid);
        order.push(gid);
      }
    }
  };

  // Process sorted leaf options to establish ordering
  for (const option of sortedOptions) {
    const directParentId = resolveParent(option.groupId);

    if (directParentId !== null) {
      // Ensure the full ancestor chain is placed first
      ensureAncestorsPlaced(directParentId);
    }

    // Place the leaf option itself
    const order = parentOrder.get(directParentId)!;
    const orderSet = parentOrderSet.get(directParentId)!;
    const leafKey = `leaf:${option.id}`;
    if (!orderSet.has(leafKey)) {
      orderSet.add(leafKey);
      order.push(leafKey);
    }
  }

  // Build node map for groups
  const groupNodes = new Map<string, OptionGroupNode>();
  for (const group of groups) {
    groupNodes.set(group.id, {
      id: group.id,
      label: group.label,
      groupId: group.groupId,
      isGroup: true,
      children: [],
    });
  }

  // Leaf option map for fast lookup
  const optionByLeafKey = new Map<string, OptionWithVisibility>();
  for (const opt of sortedOptions) {
    optionByLeafKey.set(`leaf:${opt.id}`, opt);
  }

  // Recursive builder: given a parent, build its ordered children array
  const buildChildren = (parentId: string | null): OptionTreeNode[] => {
    const order = parentOrder.get(parentId) ?? [];
    const result: OptionTreeNode[] = [];
    for (const key of order) {
      if (key.startsWith('leaf:')) {
        const opt = optionByLeafKey.get(key);
        if (opt) {
          result.push({ ...opt, isGroup: false as const });
        }
      } else {
        // It's a group ID
        const groupNode = groupNodes.get(key);
        if (groupNode && !placed.has(key)) {
          placed.add(key);
          groupNode.children = buildChildren(key);
          result.push(groupNode);
        }
      }
    }
    return result;
  };

  return buildChildren(null);
}

/**
 * Recursively flattens an N-level tree back to a flat ContentDisplayItem array.
 * Only leaf columns are emitted (depth-first order, group children follow the group).
 */
export function flattenOptionTree(
  tree: OptionTreeNode[]
): ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem> {
  const result: CollectionPreferencesProps.ContentDisplayItem[] = [];
  const walk = (nodes: OptionTreeNode[]) => {
    for (const node of nodes) {
      if (node.isGroup) {
        walk(node.children); // FIXED: recurse into children instead of treating them as leaves
      } else {
        result.push({ id: node.id, visible: node.visible });
      }
    }
  };
  walk(tree);
  return result;
}

export function getFilteredOptions(options: ReadonlyArray<OptionWithVisibility>, filterText: string) {
  filterText = filterText.trim().toLowerCase();

  if (!filterText) {
    return options;
  }

  return options.filter(option => option.label.toLowerCase().trim().includes(filterText));
}

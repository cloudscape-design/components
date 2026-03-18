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
  isGroup: true;
  children: OptionTreeNode[];
  visible: boolean;
}

/** A flat leaf column node (not a group header). */
export interface OptionLeafNode extends OptionWithVisibility {
  isGroup: false;
}

export type OptionTreeNode = OptionGroupNode | OptionLeafNode;

/**
 * Extracts a flat ordered list of leaf items from the contentDisplay tree (depth-first).
 * Used for `getSortedOptions` to rebuild the sorted option list with correct order,
 * and to flatten the internal tree back to a public-facing ContentDisplayItem[] before emitting onChange.
 */
export function walkLeaves(
  items: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>
): { id: string; visible: boolean }[] {
  const result: { id: string; visible: boolean }[] = [];
  const walk = (nodes: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>) => {
    for (const node of nodes) {
      if (node.type === 'group') {
        walk(node.children);
      } else {
        result.push({ id: node.id, visible: node.visible });
      }
    }
  };
  walk(items);
  return result;
}

export function getSortedOptions({
  options,
  contentDisplay,
}: {
  options: ReadonlyArray<CollectionPreferencesProps.ContentDisplayOption>;
  contentDisplay: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>;
}): ReadonlyArray<OptionWithVisibility> {
  // Walk the tree depth-first to get ordered leaf items
  const leaves = walkLeaves(contentDisplay);

  // By using a Map, we are guaranteed to preserve insertion order on future iteration.
  const optionsById = new Map<string, OptionWithVisibility>();

  // Insert leaves first so we respect the currently selected order
  for (const { id, visible } of leaves) {
    optionsById.set(id, { id, label: id, visible });
  }

  // Merge options metadata, and insert any that were not in contentDisplay as non-visible
  for (const option of options) {
    const existing = optionsById.get(option.id);
    optionsById.set(option.id, { ...option, visible: !!existing?.visible });
  }

  return Array.from(optionsById.values());
}

/**
 * Directly converts a ContentDisplayItem[] tree into an OptionTreeNode[] tree,
 * looking up labels from the options and groups lookup maps.
 * This preserves arbitrary nesting depth without any reconstruction.
 */
function convertTree(
  items: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>,
  optionByKey: Map<string, CollectionPreferencesProps.ContentDisplayOption>,
  groupByKey: Map<string, CollectionPreferencesProps.ContentDisplayOptionGroup>,
  sortedOptionsById: Map<string, OptionWithVisibility>
): OptionTreeNode[] {
  const result: OptionTreeNode[] = [];
  for (const item of items) {
    if (item.type === 'group') {
      const groupDef = groupByKey.get(item.id);
      result.push({
        id: item.id,
        label: groupDef?.label ?? item.id,
        isGroup: true,
        children: convertTree(item.children, optionByKey, groupByKey, sortedOptionsById),
        visible: item.visible,
      });
    } else {
      const opt = sortedOptionsById.get(item.id);
      if (opt) {
        result.push({ ...opt, isGroup: false as const });
      }
    }
  }
  return result;
}

export function buildOptionTree(
  sortedOptions: ReadonlyArray<OptionWithVisibility>,
  groups: ReadonlyArray<CollectionPreferencesProps.ContentDisplayOptionGroup>,
  contentDisplay: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>
): OptionTreeNode[] {
  if (!groups || groups.length === 0) {
    return sortedOptions.map(opt => ({ ...opt, isGroup: false as const }));
  }

  const groupByKey = new Map<string, CollectionPreferencesProps.ContentDisplayOptionGroup>();
  for (const group of groups) {
    groupByKey.set(group.id, group);
  }

  const optionByKey = new Map<string, CollectionPreferencesProps.ContentDisplayOption>();
  // (not used directly in convertTree but kept for future extension)

  const sortedOptionsById = new Map<string, OptionWithVisibility>();
  for (const opt of sortedOptions) {
    sortedOptionsById.set(opt.id, opt);
  }

  return convertTree(contentDisplay, optionByKey, groupByKey, sortedOptionsById);
}

/**
 * Converts an OptionTreeNode[] back to ContentDisplayItem[], preserving the group hierarchy.
 * Group nodes become ContentDisplayGroup entries with their children.
 * Leaf nodes become ContentDisplayItem entries.
 */
export function flattenOptionTree(
  tree: OptionTreeNode[]
): ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem> {
  const convert = (nodes: OptionTreeNode[]): CollectionPreferencesProps.ContentDisplayItem[] => {
    return nodes.map(node => {
      if (node.isGroup) {
        return {
          type: 'group' as const,
          id: node.id,
          children: convert(node.children) as ReadonlyArray<CollectionPreferencesProps.ContentDisplayColumn>,
          visible: node.visible,
        };
      } else {
        return { id: node.id, visible: node.visible };
      }
    });
  };
  return convert(tree);
}

export function getFilteredOptions(options: ReadonlyArray<OptionWithVisibility>, filterText: string) {
  filterText = filterText.trim().toLowerCase();

  if (!filterText) {
    return options;
  }

  return options.filter(option => option.label.toLowerCase().trim().includes(filterText));
}

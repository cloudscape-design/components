// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { CollectionPreferencesProps } from '../interfaces';

type ContentDisplayItem = CollectionPreferencesProps.ContentDisplayItem;
type ContentDisplayOption = CollectionPreferencesProps.ContentDisplayOption;
type ContentDisplayOptionGroup = CollectionPreferencesProps.ContentDisplayOptionGroup;

export interface OptionWithVisibility extends ContentDisplayOption {
  visible: boolean;
}

export interface OptionGroupNode {
  type: 'group';
  id: string;
  label: string;
  visible: boolean;
  children: OptionTreeNode[];
}

export interface OptionLeafNode extends OptionWithVisibility {
  type: 'leaf';
}

export type OptionTreeNode = OptionGroupNode | OptionLeafNode;

/**
 * Extracts a flat ordered list of leaf items from the contentDisplay tree (depth-first).
 */
export function walkLeaves(items: ReadonlyArray<ContentDisplayItem>): { id: string; visible: boolean }[] {
  const result: { id: string; visible: boolean }[] = [];
  for (const item of items) {
    if (item.type === 'group') {
      result.push(...walkLeaves(item.children));
    } else {
      result.push({ id: item.id, visible: item.visible });
    }
  }
  return result;
}

/**
 * Returns options ordered by contentDisplay, with visibility applied.
 * Options not in contentDisplay are appended as non-visible.
 */
export function getSortedOptions({
  options,
  contentDisplay,
}: {
  options: ReadonlyArray<CollectionPreferencesProps.ContentDisplayOption>;
  contentDisplay: ReadonlyArray<CollectionPreferencesProps.ContentDisplayItem>;
}): ReadonlyArray<OptionWithVisibility> {
  const optionMap = new Map(options.map(o => [o.id, o]));
  const result = new Map<string, OptionWithVisibility>();

  for (const { id, visible } of walkLeaves(contentDisplay)) {
    const option = optionMap.get(id);
    if (option) {
      result.set(id, { ...option, visible });
    }
  }

  for (const option of options) {
    if (!result.has(option.id)) {
      result.set(option.id, { ...option, visible: false });
    }
  }

  return Array.from(result.values());
}

/**
 * Converts contentDisplay tree into an internal OptionTreeNode tree,
 * resolving labels from options/groups definitions.
 */
export function buildOptionTree(
  options: ReadonlyArray<ContentDisplayOption>,
  groups: ReadonlyArray<ContentDisplayOptionGroup>,
  contentDisplay: ReadonlyArray<ContentDisplayItem>
): OptionTreeNode[] {
  if (!groups.length) {
    const sorted = getSortedOptions({ options, contentDisplay });
    return sorted.map(opt => ({ ...opt, type: 'leaf' as const }));
  }

  const optionMap = new Map(options.map(o => [o.id, o]));
  const groupMap = new Map(groups.map(g => [g.id, g]));

  const convert = (items: ReadonlyArray<ContentDisplayItem>): OptionTreeNode[] => {
    const result: OptionTreeNode[] = [];
    for (const item of items) {
      if (item.type === 'group') {
        const group = groupMap.get(item.id);
        result.push({
          type: 'group',
          id: item.id,
          label: group?.label ?? item.id,
          visible: item.visible,
          children: convert(item.children),
        });
      } else {
        const option = optionMap.get(item.id);
        if (option) {
          result.push({ type: 'leaf', ...option, visible: item.visible });
        }
      }
    }
    return result;
  };

  return convert(contentDisplay);
}

/**
 * Converts OptionTreeNode[] back to ContentDisplayItem[].
 */
export function toContentDisplayItems(tree: OptionTreeNode[]): ContentDisplayItem[] {
  return tree.map(node => {
    if (node.type === 'group') {
      return {
        type: 'group' as const,
        id: node.id,
        visible: node.visible,
        children: toContentDisplayItems(node.children),
      };
    }
    return { id: node.id, visible: node.visible };
  });
}

/**
 * Filters tree, keeping leaves matching filterText and groups with matching descendants.
 */
export function getFilteredTree(tree: OptionTreeNode[], filterText: string): OptionTreeNode[] {
  const text = filterText.trim().toLowerCase();
  if (!text) {
    return tree;
  }

  const result: OptionTreeNode[] = [];
  for (const node of tree) {
    if (node.type === 'group') {
      const children = getFilteredTree(node.children, text);
      if (children.length > 0) {
        result.push({ ...node, children });
      }
    } else if (node.label.toLowerCase().includes(text)) {
      result.push(node);
    }
  }
  return result;
}

export function getFilteredOptions(options: ReadonlyArray<OptionWithVisibility>, filterText: string) {
  const text = filterText.trim().toLowerCase();
  if (!text) {
    return options;
  }
  return options.filter(option => option.label.toLowerCase().includes(text));
}

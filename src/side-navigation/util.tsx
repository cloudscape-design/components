// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { SideNavigationProps } from './interfaces';

type ExpandableItem = SideNavigationProps.Section | SideNavigationProps.ExpandableLinkGroup;

export function hasActiveLink(items: ReadonlyArray<SideNavigationProps.Item>, activeHref: string): boolean {
  for (const item of items) {
    if (
      (item.type === 'link' || item.type === 'link-group' || item.type === 'expandable-link-group') &&
      item.href === activeHref
    ) {
      return true;
    }
    if (
      (item.type === 'section' || item.type === 'link-group' || item.type === 'expandable-link-group') &&
      hasActiveLink(item.items, activeHref)
    ) {
      return true;
    }
  }
  return false;
}

// Determines whether any top-level navigation item has an icon.
export function hasNavigationIcons(items: ReadonlyArray<SideNavigationProps.Item>): boolean {
  const iconKey: keyof SideNavigationProps.Link = 'icon';
  return items.some(item => iconKey in item && !!item.icon);
}

export function generateExpandableItemsMapping(
  items: ReadonlyArray<SideNavigationProps.Item>,
  mapping: WeakMap<SideNavigationProps.Item, ReadonlyArray<ExpandableItem>> = new WeakMap(),
  expandableParents: ReadonlyArray<ExpandableItem> = []
): WeakMap<SideNavigationProps.Item, ReadonlyArray<ExpandableItem>> {
  items.forEach(item => {
    const nextLevelParents = expandableParents.slice();
    if (item.type === 'section' || item.type === 'expandable-link-group') {
      mapping.set(item, expandableParents);
      nextLevelParents.unshift(item);
    }
    if (item.type === 'section' || item.type === 'link-group' || item.type === 'expandable-link-group') {
      generateExpandableItemsMapping(item.items, mapping, nextLevelParents);
    }
  });
  return mapping;
}

export function checkDuplicateHrefs(items: ReadonlyArray<SideNavigationProps.Item>) {
  const hrefs = new Set();
  const queue = items.slice();
  while (queue.length > 0) {
    // We just checked that there's items in the queue.
    const item = queue.shift()!;

    // Check duplicated hrefs
    const hrefKey: keyof SideNavigationProps.Link = 'href';
    if (hrefKey in item) {
      if (hrefs.has(item.href)) {
        warnOnce('SideNavigation', `duplicate href in "${item.text}": ${item.href}`);
      }
      hrefs.add(item.href);
    }

    const itemsKey: keyof SideNavigationProps.Section = 'items';
    if (itemsKey in item) {
      queue.push(...item.items);
    }
  }
}

/**
 * Warns when a collapsed-rail link (root-level link, link-group, ELG, or
 * promoted root-section child) would render without an icon, making it
 * invisible in the collapsed state.
 *
 * Plain links without icons are hidden entirely. Link-groups and ELGs without
 * icons render with no visual indicator. Root-level sections/section-groups
 * promote their direct children, so icon-less children there are also hidden.
 */
export function checkCollapsedIconSupport(items: ReadonlyArray<SideNavigationProps.Item>, collapsed: boolean) {
  if (!collapsed) {
    return;
  }

  function warnMissingIcon(
    item: SideNavigationProps.Link | SideNavigationProps.LinkGroup | SideNavigationProps.ExpandableLinkGroup,
    context?: string
  ) {
    if (item.icon) {
      return;
    }
    const article = item.type === 'expandable-link-group' ? 'An' : 'A';
    const consequence = item.type === 'link' ? 'will be hidden' : 'will have no visual indicator';
    const prefix =
      item.type === 'link' && !context ? `${article} root-level "${item.type}"` : `${article} "${item.type}"`;
    const suffix = context ? ` inside ${context}` : '';

    warnOnce(
      'SideNavigation',
      `${prefix} ("${item.text}")${suffix} has no icon and ${consequence} when collapsed. ` +
        'Add an icon to make it visible in the collapsed rail.'
    );
  }

  for (const item of items) {
    switch (item.type) {
      case 'link':
      case 'link-group':
      case 'expandable-link-group':
        warnMissingIcon(item);
        break;
      case 'section':
        for (const child of item.items) {
          if (child.type === 'link' || child.type === 'link-group' || child.type === 'expandable-link-group') {
            warnMissingIcon(child, `section "${item.text}"`);
          }
        }
        break;
      case 'section-group':
        for (const child of item.items) {
          if (child.type === 'link' || child.type === 'link-group' || child.type === 'expandable-link-group') {
            warnMissingIcon(child, `section-group "${item.title}"`);
          }
        }
        break;
    }
  }
}

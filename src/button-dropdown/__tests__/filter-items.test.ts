// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonDropdownProps } from '../interfaces';
import { filterItems } from '../utils/filter-items';
import { isItemGroup } from '../utils/utils';

const items: ButtonDropdownProps.Items = [
  { id: 'cut', text: 'Cut' },
  { id: 'copy', text: 'Copy' },
  { id: 'paste', text: 'Paste' },
  { id: 'settings', text: 'Settings', secondaryText: 'Configure preferences' },
  { id: 'tagged', text: 'Tagged item', labelTag: 'Beta' },
];

const groupedItems: ButtonDropdownProps.Items = [
  {
    text: 'Edit',
    items: [
      { id: 'cut', text: 'Cut' },
      { id: 'copy', text: 'Copy' },
      { id: 'paste', text: 'Paste' },
    ],
  },
  {
    text: 'View',
    items: [
      { id: 'zoom-in', text: 'Zoom in' },
      { id: 'zoom-out', text: 'Zoom out' },
    ],
  },
  { id: 'settings', text: 'Settings' },
];

describe('filterItems', () => {
  it('returns all items when filterText is empty', () => {
    expect(filterItems(items, '')).toBe(items);
  });

  it('filters items by text (case-insensitive)', () => {
    const result = filterItems(items, 'cop');
    expect(result).toHaveLength(1);
    expect((result[0] as ButtonDropdownProps.Item).id).toBe('copy');
  });

  it('filters items by text (case-insensitive, uppercase query)', () => {
    const result = filterItems(items, 'CUT');
    expect(result).toHaveLength(1);
    expect((result[0] as ButtonDropdownProps.Item).id).toBe('cut');
  });

  it('filters items by secondaryText', () => {
    const result = filterItems(items, 'prefer');
    expect(result).toHaveLength(1);
    expect((result[0] as ButtonDropdownProps.Item).id).toBe('settings');
  });

  it('filters items by labelTag', () => {
    const result = filterItems(items, 'beta');
    expect(result).toHaveLength(1);
    expect((result[0] as ButtonDropdownProps.Item).id).toBe('tagged');
  });

  it('returns empty array when nothing matches', () => {
    const result = filterItems(items, 'xyz');
    expect(result).toHaveLength(0);
  });

  describe('groups', () => {
    it('does not match on group title text', () => {
      const result = filterItems(groupedItems, 'Edit');
      expect(result).toHaveLength(0);
    });

    it('includes group with only matching children when children match', () => {
      const result = filterItems(groupedItems, 'zoom');
      expect(result).toHaveLength(1);
      const group = result[0] as ButtonDropdownProps.ItemGroup;
      expect(group.text).toBe('View');
      expect(group.items).toHaveLength(2);
    });

    it('includes group with partial matching children', () => {
      const result = filterItems(groupedItems, 'cut');
      expect(result).toHaveLength(1);
      const group = result[0] as ButtonDropdownProps.ItemGroup;
      expect(group.text).toBe('Edit');
      expect(group.items).toHaveLength(1);
      expect((group.items[0] as ButtonDropdownProps.Item).id).toBe('cut');
    });

    it('includes flat items that match alongside groups', () => {
      const result = filterItems(groupedItems, 'set');
      expect(result).toHaveLength(1);
      expect((result[0] as ButtonDropdownProps.Item).id).toBe('settings');
    });

    it('excludes groups with no matching children', () => {
      const result = filterItems(groupedItems, 'paste');
      expect(result).toHaveLength(1);
      const group = result[0] as ButtonDropdownProps.ItemGroup;
      expect(group.text).toBe('Edit');
      expect(group.items).toHaveLength(1);
      expect((group.items[0] as ButtonDropdownProps.Item).id).toBe('paste');
    });
  });

  describe('nested groups', () => {
    const nestedItems: ButtonDropdownProps.Items = [
      {
        text: 'Compute',
        items: [
          { id: 'launch', text: 'Launch instance' },
          {
            text: 'Auto scaling',
            items: [
              { id: 'create-asg', text: 'Create Auto Scaling group' },
              { id: 'delete-asg', text: 'Delete Auto Scaling group' },
            ],
          },
        ],
      },
    ];

    it('matches an item nested inside a sub-group', () => {
      const result = filterItems(nestedItems, 'create');
      expect(result).toHaveLength(1);
      const group = result[0] as ButtonDropdownProps.ItemGroup;
      expect(group.text).toBe('Compute');
      expect(group.items).toHaveLength(1);
      expect((group.items[0] as ButtonDropdownProps.Item).id).toBe('create-asg');
    });

    it('flattens descendants into the top-most group, keeping only its header', () => {
      const result = filterItems(nestedItems, 'scaling');
      expect(result).toHaveLength(1);
      const group = result[0] as ButtonDropdownProps.ItemGroup;
      expect(group.text).toBe('Compute');
      // "Launch instance" does not match, but both auto-scaling actions do.
      // The nested "Auto scaling" sub-group header is dropped; its items are
      // hoisted directly into the top-level group.
      expect(group.items).toHaveLength(2);
      expect(group.items.every(item => !isItemGroup(item))).toBe(true);
      expect((group.items[0] as ButtonDropdownProps.Item).id).toBe('create-asg');
      expect((group.items[1] as ButtonDropdownProps.Item).id).toBe('delete-asg');
    });

    it('excludes sub-groups with no matching descendants', () => {
      const result = filterItems(nestedItems, 'launch');
      expect(result).toHaveLength(1);
      const group = result[0] as ButtonDropdownProps.ItemGroup;
      expect(group.items).toHaveLength(1);
      expect((group.items[0] as ButtonDropdownProps.Item).id).toBe('launch');
    });
  });
});

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import ExpandableSection from '../../../lib/components/expandable-section';
import IconProvider, { IconProviderProps } from '../../../lib/components/icon-provider';
import SideNavigation from '../../../lib/components/side-navigation';
import Table, { TableProps } from '../../../lib/components/table';
import TreeView from '../../../lib/components/tree-view';

import expandableSectionStyles from '../../../lib/components/expandable-section/styles.css.js';

const expandToggle = ({ expanded }: { expanded: boolean }) => (
  <span data-testid={expanded ? 'toggle-expanded' : 'toggle-collapsed'} />
);

function renderWithProvider(componentIcons: IconProviderProps.ComponentIcons, children: React.ReactNode) {
  return render(
    <IconProvider icons={null} componentIcons={componentIcons}>
      {children}
    </IconProvider>
  );
}

describe('IconProvider componentIcons', () => {
  describe('expandable section', () => {
    it('renders the custom expand toggle without the default rotation class', () => {
      const { queryByTestId, container } = renderWithProvider(
        { 'expandable-section': { expandToggle } },
        <ExpandableSection headerText="Section" />
      );
      expect(queryByTestId('toggle-collapsed')).toBeTruthy();
      expect(container.querySelector(`.${expandableSectionStyles.icon}`)).toBeFalsy();
    });

    it('passes the current state to the renderer', () => {
      const { queryByTestId } = renderWithProvider(
        { 'expandable-section': { expandToggle } },
        <ExpandableSection headerText="Section" defaultExpanded={true} />
      );
      expect(queryByTestId('toggle-expanded')).toBeTruthy();
    });

    it('falls back to the default icon when the renderer returns null', () => {
      const { container } = renderWithProvider(
        { 'expandable-section': { expandToggle: () => null } },
        <ExpandableSection headerText="Section" />
      );
      expect(container.querySelector(`.${expandableSectionStyles.icon}`)).toBeTruthy();
    });

    it('applies to expandable sections rendered inside side navigation', () => {
      const { queryByTestId } = renderWithProvider(
        { 'expandable-section': { expandToggle } },
        <SideNavigation
          items={[{ type: 'section', text: 'Section', items: [{ type: 'link', text: 'Link', href: '#' }] }]}
        />
      );
      expect(queryByTestId('toggle-expanded')).toBeTruthy();
    });
  });

  describe('table', () => {
    interface Item {
      id: string;
      parentId: null | string;
    }
    const columns: TableProps.ColumnDefinition<Item>[] = [
      { id: 'id', header: 'id', cell: item => item.id, sortingField: 'id' },
      { id: 'other', header: 'other', cell: item => item.id, sortingField: 'other' },
    ];
    const items: Item[] = [
      { id: 'a', parentId: null },
      { id: 'a.1', parentId: 'a' },
    ];

    it('renders per-state custom sorting indicators', () => {
      const { queryAllByTestId } = renderWithProvider(
        { table: { sortingIndicator: ({ sortingState }) => <span data-testid={`sort-${sortingState}`} /> } },
        <Table columnDefinitions={columns} items={items} sortingColumn={{ sortingField: 'id' }} />
      );
      expect(queryAllByTestId('sort-ascending')).toHaveLength(1);
      expect(queryAllByTestId('sort-sortable')).toHaveLength(1);
    });

    it('renders the custom expand toggle for expandable rows', () => {
      const { queryAllByTestId } = renderWithProvider(
        { table: { expandToggle } },
        <Table
          columnDefinitions={columns}
          items={items.filter(item => !item.parentId)}
          expandableRows={{
            getItemChildren: item => items.filter(child => child.parentId === item.id),
            isItemExpandable: item => !item.parentId,
            expandedItems: [],
            onExpandableItemToggle: () => {},
          }}
        />
      );
      expect(queryAllByTestId('toggle-collapsed')).toHaveLength(1);
    });
  });

  describe('tree view', () => {
    interface Item {
      id: string;
      children?: Item[];
    }
    const defaultProps = {
      items: [{ id: 'a', children: [{ id: 'a.1' }] }] as Item[],
      renderItem: (item: Item) => ({ content: item.id }),
      getItemId: (item: Item) => item.id,
      getItemChildren: (item: Item) => item.children,
    };

    it('renders the custom expand toggle with the current state', () => {
      const { queryAllByTestId } = renderWithProvider(
        { 'tree-view': { expandToggle } },
        <TreeView {...defaultProps} expandedItems={['a']} />
      );
      expect(queryAllByTestId('toggle-expanded')).toHaveLength(1);
    });

    it('gives precedence to the deprecated renderItemToggleIcon', () => {
      const { queryAllByTestId } = renderWithProvider(
        { 'tree-view': { expandToggle } },
        <TreeView {...defaultProps} renderItemToggleIcon={() => <span data-testid="per-component" />} />
      );
      expect(queryAllByTestId('per-component')).toHaveLength(1);
      expect(queryAllByTestId('toggle-collapsed')).toHaveLength(0);
    });
  });

  describe('inheritance', () => {
    it('merges component icons across nested providers, closest provider wins', () => {
      const { queryByTestId } = render(
        <IconProvider icons={null} componentIcons={{ 'expandable-section': { expandToggle } }}>
          <IconProvider
            icons={null}
            componentIcons={{ 'expandable-section': { expandToggle: () => <span data-testid="inner" /> } }}
          >
            <ExpandableSection headerText="Section" />
          </IconProvider>
        </IconProvider>
      );
      expect(queryByTestId('inner')).toBeTruthy();
      expect(queryByTestId('toggle-collapsed')).toBeFalsy();
    });

    it('resets all component icons when set to null', () => {
      const { queryByTestId } = render(
        <IconProvider icons={null} componentIcons={{ 'expandable-section': { expandToggle } }}>
          <IconProvider icons={null} componentIcons={null}>
            <ExpandableSection headerText="Section" />
          </IconProvider>
        </IconProvider>
      );
      expect(queryByTestId('toggle-collapsed')).toBeFalsy();
    });
  });
});

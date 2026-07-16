// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import ExpandableSection from '../../../lib/components/expandable-section';
import IconProvider, { IconProviderProps } from '../../../lib/components/icon-provider';
import Table, { TableProps } from '../../../lib/components/table';

const expandToggleGroup: IconProviderProps.IconGroups = {
  'expand-toggle': ({ expanded }) => <span data-testid={expanded ? 'toggle-expanded' : 'toggle-collapsed'} />,
};

describe('IconProvider icon groups', () => {
  describe('expand-toggle icon group', () => {
    it('renders the custom icon instead of the default toggle icon', () => {
      const { queryByTestId } = render(
        <IconProvider icons={null} iconGroups={expandToggleGroup}>
          <ExpandableSection headerText="Section" />
        </IconProvider>
      );
      expect(queryByTestId('toggle-collapsed')).toBeTruthy();
    });

    it('passes the current state to the icon group renderer', () => {
      const { queryByTestId } = render(
        <IconProvider icons={null} iconGroups={expandToggleGroup}>
          <ExpandableSection headerText="Section" defaultExpanded={true} />
        </IconProvider>
      );
      expect(queryByTestId('toggle-expanded')).toBeTruthy();
      expect(queryByTestId('toggle-collapsed')).toBeFalsy();
    });

    it('falls back to the default icon when the renderer returns null', () => {
      const { queryByTestId } = render(
        <IconProvider icons={null} iconGroups={{ 'expand-toggle': () => null }}>
          <ExpandableSection headerText="Section" />
        </IconProvider>
      );
      expect(queryByTestId('toggle-collapsed')).toBeFalsy();
    });

    it('inherits the icon group in nested providers', () => {
      const { queryByTestId } = render(
        <IconProvider icons={null} iconGroups={expandToggleGroup}>
          <IconProvider icons={null}>
            <ExpandableSection headerText="Section" />
          </IconProvider>
        </IconProvider>
      );
      expect(queryByTestId('toggle-collapsed')).toBeTruthy();
    });

    it('resets a specific icon group when set to null in a nested provider', () => {
      const { queryByTestId } = render(
        <IconProvider icons={null} iconGroups={expandToggleGroup}>
          <IconProvider icons={null} iconGroups={{ 'expand-toggle': null }}>
            <ExpandableSection headerText="Section" />
          </IconProvider>
        </IconProvider>
      );
      expect(queryByTestId('toggle-collapsed')).toBeFalsy();
    });

    it('resets all icon groups when the property is set to null in a nested provider', () => {
      const { queryByTestId } = render(
        <IconProvider icons={null} iconGroups={expandToggleGroup}>
          <IconProvider icons={null} iconGroups={null}>
            <ExpandableSection headerText="Section" />
          </IconProvider>
        </IconProvider>
      );
      expect(queryByTestId('toggle-collapsed')).toBeFalsy();
    });
  });

  describe('sorting-indicator icon group', () => {
    interface Item {
      id: number;
      name: string;
    }
    const columns: TableProps.ColumnDefinition<Item>[] = [
      { id: 'id', header: 'id', cell: item => item.id, sortingField: 'id' },
      { id: 'name', header: 'name', cell: item => item.name, sortingField: 'name' },
    ];
    const items: Item[] = [{ id: 1, name: 'Apples' }];

    it('renders per-state icons for the sorting indicator', () => {
      const { queryAllByTestId } = render(
        <IconProvider
          icons={null}
          iconGroups={{
            'sorting-indicator': ({ sortingState }) => <span data-testid={`sort-${sortingState}`} />,
          }}
        >
          <Table
            columnDefinitions={columns}
            items={items}
            sortingColumn={{ sortingField: 'id' }}
            sortingDescending={false}
          />
        </IconProvider>
      );
      // The sorted column shows the ascending icon; the other sortable column shows the sortable icon.
      expect(queryAllByTestId('sort-ascending')).toHaveLength(1);
      expect(queryAllByTestId('sort-sortable')).toHaveLength(1);
      expect(queryAllByTestId('sort-descending')).toHaveLength(0);
    });
  });
});

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import ExpandableSection from '../../../lib/components/expandable-section';
import IconProvider, { IconProviderProps } from '../../../lib/components/icon-provider';
import Table, { TableProps } from '../../../lib/components/table';

const expandToggleOverride: IconProviderProps.Overrides = {
  'expand-toggle': ({ expanded }) => <span data-testid={expanded ? 'toggle-expanded' : 'toggle-collapsed'} />,
};

describe('IconProvider overrides', () => {
  describe('expand-toggle override', () => {
    it('renders the override instead of the default toggle icon', () => {
      const { queryByTestId } = render(
        <IconProvider icons={null} overrides={expandToggleOverride}>
          <ExpandableSection headerText="Section" />
        </IconProvider>
      );
      expect(queryByTestId('toggle-collapsed')).toBeTruthy();
    });

    it('passes the current state to the override renderer', () => {
      const { queryByTestId } = render(
        <IconProvider icons={null} overrides={expandToggleOverride}>
          <ExpandableSection headerText="Section" defaultExpanded={true} />
        </IconProvider>
      );
      expect(queryByTestId('toggle-expanded')).toBeTruthy();
      expect(queryByTestId('toggle-collapsed')).toBeFalsy();
    });

    it('falls back to the default icon when the renderer returns null', () => {
      const { queryByTestId } = render(
        <IconProvider icons={null} overrides={{ 'expand-toggle': () => null }}>
          <ExpandableSection headerText="Section" />
        </IconProvider>
      );
      expect(queryByTestId('toggle-collapsed')).toBeFalsy();
    });

    it('inherits the override in nested providers', () => {
      const { queryByTestId } = render(
        <IconProvider icons={null} overrides={expandToggleOverride}>
          <IconProvider icons={null}>
            <ExpandableSection headerText="Section" />
          </IconProvider>
        </IconProvider>
      );
      expect(queryByTestId('toggle-collapsed')).toBeTruthy();
    });

    it('resets a specific override when set to null in a nested provider', () => {
      const { queryByTestId } = render(
        <IconProvider icons={null} overrides={expandToggleOverride}>
          <IconProvider icons={null} overrides={{ 'expand-toggle': null }}>
            <ExpandableSection headerText="Section" />
          </IconProvider>
        </IconProvider>
      );
      expect(queryByTestId('toggle-collapsed')).toBeFalsy();
    });

    it('resets all overrides when the property is set to null in a nested provider', () => {
      const { queryByTestId } = render(
        <IconProvider icons={null} overrides={expandToggleOverride}>
          <IconProvider icons={null} overrides={null}>
            <ExpandableSection headerText="Section" />
          </IconProvider>
        </IconProvider>
      );
      expect(queryByTestId('toggle-collapsed')).toBeFalsy();
    });
  });

  describe('sorting-indicator override', () => {
    interface Item {
      id: number;
      name: string;
    }
    const columns: TableProps.ColumnDefinition<Item>[] = [
      { id: 'id', header: 'id', cell: item => item.id, sortingField: 'id' },
      { id: 'name', header: 'name', cell: item => item.name, sortingField: 'name' },
    ];
    const items: Item[] = [{ id: 1, name: 'Apples' }];

    it('renders per-state overrides for the sorting indicator', () => {
      const { queryAllByTestId } = render(
        <IconProvider
          icons={null}
          overrides={{
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
      // The sorted column shows the ascending override; the other sortable column shows the sortable override.
      expect(queryAllByTestId('sort-ascending')).toHaveLength(1);
      expect(queryAllByTestId('sort-sortable')).toHaveLength(1);
      expect(queryAllByTestId('sort-descending')).toHaveLength(0);
    });
  });
});

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render as rtlRender, waitFor } from '@testing-library/react';

import CollectionPreferences from '../../../lib/components/collection-preferences';
import { ComponentMetrics } from '../../../lib/components/internal/analytics';
import Pagination from '../../../lib/components/pagination';
import PropertyFilter from '../../../lib/components/property-filter';
import { FilteringProperty } from '../../../lib/components/property-filter/interfaces';
import Table, { TableProps } from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';
import TextFilter from '../../../lib/components/text-filter';
import { mockComponentMetrics } from '../../internal/analytics/__tests__/mocks';
import { i18nStrings } from '../../property-filter/__tests__/common';

interface Item {
  id: number;
  name: string;
}

const defaultColumns: TableProps.ColumnDefinition<Item>[] = [
  { id: 'id', header: 'id', cell: item => item.id },
  { id: 'name', header: 'name', cell: item => item.name },
];

const defaultItems: Item[] = [
  { id: 1, name: 'Apples' },
  { id: 2, name: 'Oranges' },
  { id: 3, name: 'Bananas' },
];

const baseComponentConfiguration = {
  filtered: false,
  filteredBy: [],
  flowType: null,
  instanceIdentifier: null,
  pagination: {
    currentPageIndex: 0,
    openEnd: false,
    totalNumberOfPages: null,
  },
  patternIdentifier: '',
  resourcesSelected: false,
  sortedBy: { columnId: null, sortingOrder: null },
  tablePreferences: { resourcesPerPage: null, visibleColumns: [] },
  taskName: undefined,
  totalNumberOfResourcesText: null,
  variant: 'container',
};

beforeEach(() => {
  jest.resetAllMocks();
  mockComponentMetrics();
});

function render(jsx: React.ReactElement) {
  const { container, rerender } = rtlRender(jsx);

  return {
    tableWrapper: createWrapper(container).findTable()!,
    textFilterWrapper: createWrapper(container).findTable()!.findTextFilter()!,
    propertyFilterWrapper: createWrapper(container).findTable()!.findPropertyFilter()!,
    paginationWrapper: createWrapper(container).findTable()!.findPagination()!,
    rerender,
  };
}

// FIXME: Something broken with test isolation, enabling this breaks the other tests
test.skip('should track component mount', () => {
  const TestComponent = () => <Table items={[]} columnDefinitions={[]} />;
  const { rerender } = render(<TestComponent />);

  rerender(<TestComponent />);
  rerender(<TestComponent />);

  expect(ComponentMetrics.componentMounted).toHaveBeenCalledTimes(1);
  expect(ComponentMetrics.componentMounted).toHaveBeenCalledWith(
    expect.objectContaining({
      componentConfiguration: expect.any(Object),
      taskInteractionId: expect.any(String),
      componentName: 'table',
    })
  );
});

describe('pagination', () => {
  test('tracks component updates caused by pagination', async () => {
    const { paginationWrapper, rerender } = render(
      <Table
        items={defaultItems}
        columnDefinitions={defaultColumns}
        pagination={<Pagination currentPageIndex={0} pagesCount={5} />}
      />
    );

    paginationWrapper.findPageNumberByIndex(2)!.click();

    rerender(
      <Table
        items={[
          { id: 4, name: 'Pears' },
          { id: 5, name: 'Naartjes' },
          { id: 6, name: 'Pineapple' },
        ]}
        columnDefinitions={defaultColumns}
        pagination={<Pagination currentPageIndex={1} pagesCount={5} />}
      />
    );

    await waitFor(() => {
      expect(ComponentMetrics.componentUpdated).toHaveBeenCalledTimes(1);
    });

    expect(ComponentMetrics.componentUpdated).toHaveBeenCalledWith({
      actionType: 'pagination',
      componentConfiguration: {
        ...baseComponentConfiguration,
        pagination: {
          currentPageIndex: 1,
          openEnd: false,
          totalNumberOfPages: 5,
        },
        totalNumberOfResources: 3,
      },
      componentName: 'table',
      taskInteractionId: expect.any(String),
    });
  });
});

describe('filtering', () => {
  test('tracks component updates caused by text filtering', async () => {
    const { textFilterWrapper, rerender } = render(
      <Table items={defaultItems} columnDefinitions={defaultColumns} filter={<TextFilter filteringText="" />} />
    );
    textFilterWrapper.findInput().click();
    rerender(
      <Table
        items={[defaultItems[0]]}
        columnDefinitions={defaultColumns}
        filter={<TextFilter filteringText="Filter text" />}
      />
    );

    await waitFor(() => {
      expect(ComponentMetrics.componentUpdated).toHaveBeenCalledTimes(1);
    });

    expect(ComponentMetrics.componentUpdated).toHaveBeenCalledWith({
      actionType: 'filter',
      componentConfiguration: {
        ...baseComponentConfiguration,
        filtered: true,
        totalNumberOfResources: 1,
      },
      componentName: 'table',
      taskInteractionId: expect.any(String),
    });
  });

  test('tracks component updates caused by property filtering', async () => {
    const filteringProperties: readonly FilteringProperty[] = [
      {
        propertyLabel: 'Id',
        key: 'id',
        groupValuesLabel: 'Id values',
        operators: [':', '!:', '=', '!=', '^', '!^'],
      },
    ];
    const { propertyFilterWrapper, rerender } = render(
      <Table
        items={defaultItems}
        columnDefinitions={defaultColumns}
        filter={
          <PropertyFilter
            i18nStrings={i18nStrings}
            query={{
              tokens: [],
              operation: 'and',
            }}
            filteringProperties={filteringProperties}
            onChange={() => {}}
          />
        }
      />
    );

    propertyFilterWrapper.click();
    rerender(
      <Table
        items={[]}
        columnDefinitions={defaultColumns}
        filter={
          <PropertyFilter
            i18nStrings={i18nStrings}
            query={{
              tokens: [
                {
                  operator: '=',
                  propertyKey: 'id',
                  value: 'i-2dc5ce28a0328391',
                },
              ],
              operation: 'and',
            }}
            enableTokenGroups={true}
            filteringProperties={filteringProperties}
            onChange={() => {}}
          />
        }
      />
    );

    await waitFor(() => {
      expect(ComponentMetrics.componentUpdated).toHaveBeenCalledTimes(1);
    });

    expect(ComponentMetrics.componentUpdated).toHaveBeenCalledWith({
      actionType: 'filter',
      componentConfiguration: {
        ...baseComponentConfiguration,
        filtered: true,
        filteredBy: ['id'],
        totalNumberOfResources: 0,
      },
      componentName: 'table',
      taskInteractionId: expect.any(String),
    });
  });
});

// FIXME: Doesn't work 🙁
describe.skip('selection', () => {
  test.each<TableProps['selectionType']>(['single', 'multi'])(
    'tracks component updates caused by %s selection',
    async (selectionType: TableProps['selectionType']) => {
      const { tableWrapper, rerender } = render(
        <Table
          items={defaultItems}
          columnDefinitions={defaultColumns}
          selectedItems={[]}
          selectionType={selectionType}
        />
      );

      tableWrapper.findRowSelectionArea(1)!.click();

      rerender(
        <Table
          items={defaultItems}
          columnDefinitions={defaultColumns}
          selectedItems={[defaultItems[0]]}
          selectionType={selectionType}
        />
      );

      await waitFor(() => {
        expect(ComponentMetrics.componentUpdated).toHaveBeenCalledTimes(1);
      });

      expect(ComponentMetrics.componentUpdated).toHaveBeenCalledWith({
        actionType: 'selection',
        componentConfiguration: {
          ...baseComponentConfiguration,
          resourcesSelected: true,
          totalNumberOfResources: 3,
        },
        componentName: 'table',
        taskInteractionId: expect.any(String),
      });
    }
  );
});

describe('preferences', () => {
  test('tracks component updates caused by preferences', async () => {
    const { tableWrapper, rerender } = render(
      <Table
        items={defaultItems}
        columnDefinitions={defaultColumns}
        columnDisplay={[{ id: 'id', visible: false }]}
        preferences={
          <CollectionPreferences
            onConfirm={() => {}}
            preferences={{ contentDisplay: [{ id: 'id', visible: false }] }}
          />
        }
      />
    );

    tableWrapper.findCollectionPreferences()!.findTriggerButton().click();
    tableWrapper
      .findCollectionPreferences()!
      .findModal()!
      .findContentDisplayPreference()!
      .findOptionByIndex(1)!
      .click();

    rerender(
      <Table
        items={defaultItems}
        columnDefinitions={defaultColumns}
        columnDisplay={[{ id: 'id', visible: true }]}
        preferences={
          <CollectionPreferences onConfirm={() => {}} preferences={{ contentDisplay: [{ id: 'id', visible: true }] }} />
        }
      />
    );

    await waitFor(() => {
      expect(ComponentMetrics.componentUpdated).toHaveBeenCalledTimes(1);
    });

    expect(ComponentMetrics.componentUpdated).toHaveBeenCalledWith({
      actionType: 'preferences',
      componentConfiguration: {
        ...baseComponentConfiguration,
        pagination: {
          currentPageIndex: 0,
          openEnd: false,
          totalNumberOfPages: 5,
        },
        tablePreferences: {
          resourcesPerPage: null,
          visibleColumns: ['name'],
        },
        totalNumberOfResources: 3,
      },
      componentName: 'table',
      taskInteractionId: expect.any(String),
    });
  });
});

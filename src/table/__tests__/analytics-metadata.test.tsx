// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import Header from '../../../lib/components/header';
import Table, { TableProps } from '../../../lib/components/table';
import InternalTable from '../../../lib/components/table/internal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import abstractSwitchlabels from '../../../lib/components/internal/components/abstract-switch/analytics-metadata/styles.css.js';
import tablelabels from '../../../lib/components/table/analytics-metadata/styles.css.js';

const labels = { ...abstractSwitchlabels, ...tablelabels };
interface TableItem {
  value: string;
  description: string;
}

const items: Array<TableItem> = [
  { value: 'first', description: 'First choice.' },
  { value: 'second', description: 'Second choice' },
  { value: 'third', description: 'Third choice' },
];

const sortingComparator = () => -1;

const columnDefinitions: TableProps['columnDefinitions'] = [
  {
    id: 'valueColumn',
    header: 'Value',
    cell: item => item.value,
    sortingField: 'value',
  },
  {
    id: 'descriptionColumn',
    header: 'Description',
    cell: item => item.description,
    sortingComparator,
  },
];

const isItemDisabled = (item: TableItem) => item.value === 'second';

const componentLabel = 'Header for table';

function renderTable(props: Partial<TableProps>) {
  const renderResult = render(
    <Table
      {...props}
      items={items}
      columnDefinitions={columnDefinitions}
      trackBy="value"
      header={<Header variant="h2">{componentLabel}</Header>}
      isItemDisabled={isItemDisabled}
    />
  );
  return createWrapper(renderResult.container).findTable()!;
}

const getMetadata = (
  additionalProperties: Record<string, string>,
  innerContext?: Record<string, string>,
  event: GeneratedAnalyticsMetadataFragment = {}
) => {
  const metadata: Partial<GeneratedAnalyticsMetadata> = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.Table',
          label: componentLabel,
          properties: {
            itemsCount: '3',
            ...additionalProperties,
          },
        },
      },
    ],
  };
  if (innerContext) {
    metadata.contexts![0].detail.innerContext = innerContext;
  }
  return { ...event, ...metadata };
};

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Table renders correct analytics metadata', () => {
  describe('selection', () => {
    test('multiple', () => {
      const wrapper = renderTable({ selectionType: 'multi', selectedItems: [items[2]], variant: 'full-page' });

      const firstSelectionArea = wrapper.findRowSelectionArea(1)!.find('input')!.getElement();
      validateComponentNameAndLabels(firstSelectionArea, labels);
      expect(getGeneratedAnalyticsMetadata(firstSelectionArea)).toEqual(
        getMetadata({ selectedItemsCount: '1', selectionType: 'multi', variant: 'full-page' }, undefined, {
          action: 'select',
          detail: { position: '1', item: 'first', selected: 'true' },
        })
      );

      const disabledSelectionArea = wrapper.findRowSelectionArea(2)!.find('input')!.getElement();
      validateComponentNameAndLabels(disabledSelectionArea, labels);
      expect(getGeneratedAnalyticsMetadata(disabledSelectionArea)).toEqual(
        getMetadata({ selectedItemsCount: '1', selectionType: 'multi', variant: 'full-page' })
      );

      const thirdSelectionArea = wrapper.findRowSelectionArea(3)!.find('input')!.getElement();
      validateComponentNameAndLabels(thirdSelectionArea, labels);
      expect(getGeneratedAnalyticsMetadata(thirdSelectionArea)).toEqual(
        getMetadata({ selectedItemsCount: '1', selectionType: 'multi', variant: 'full-page' }, undefined, {
          action: 'select',
          detail: { position: '3', item: 'third', selected: 'false' },
        })
      );

      const selectAllArea = wrapper.findSelectAllTrigger()!.find('input')!.getElement();
      validateComponentNameAndLabels(selectAllArea, labels);
      expect(getGeneratedAnalyticsMetadata(selectAllArea)).toEqual(
        getMetadata({ selectedItemsCount: '1', selectionType: 'multi', variant: 'full-page' }, undefined, {
          action: 'selectAll',
          detail: { selected: 'true' },
        })
      );
    });
    test('single', () => {
      const wrapper = renderTable({ selectionType: 'single', selectedItems: [items[2]] });

      const firstSelectionArea = wrapper.findRowSelectionArea(1)!.find('input')!.getElement();
      validateComponentNameAndLabels(firstSelectionArea, labels);
      expect(getGeneratedAnalyticsMetadata(firstSelectionArea)).toEqual(
        getMetadata({ selectedItemsCount: '1', selectionType: 'single', variant: 'container' }, undefined, {
          action: 'select',
          detail: { position: '1', item: 'first' },
        })
      );

      const disabledSelectionArea = wrapper.findRowSelectionArea(2)!.find('input')!.getElement();
      validateComponentNameAndLabels(disabledSelectionArea, labels);
      expect(getGeneratedAnalyticsMetadata(disabledSelectionArea)).toEqual(
        getMetadata({ selectedItemsCount: '1', selectionType: 'single', variant: 'container' })
      );
    });
  });
  describe('innerContext', () => {
    test.each(['multi', 'none'])('with selectionType=%s', selectionType => {
      const wrapper = renderTable({
        selectionType: selectionType as TableProps['selectionType'],
        selectedItems: [items[2], items[0]],
      });
      [
        [1, 1],
        [3, 2],
      ].forEach(([row, column]) => {
        const element = wrapper.findBodyCell(row, selectionType === 'multi' ? column + 1 : column)!.getElement();
        validateComponentNameAndLabels(element, labels);
        expect(getGeneratedAnalyticsMetadata(element)).toEqual(
          getMetadata(
            { selectedItemsCount: '2', selectionType, variant: 'container' },
            {
              columnId: columnDefinitions[column - 1].id as string,
              columnLabel: columnDefinitions[column - 1].header as string,
              item: items[row - 1].value,
              position: `${row},${column}`,
            }
          )
        );
      });
    });
  });
  describe('sorting', () => {
    test('with sortingComparator', () => {
      const wrapper = renderTable({ sortingColumn: { sortingComparator } });
      const columnHeaders = wrapper.findColumnHeaders();
      const element = columnHeaders[0]!.getElement();
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toEqual(
        getMetadata(
          {
            selectedItemsCount: '0',
            selectionType: 'none',
            sortingColumnId: 'descriptionColumn',
            sortingDescending: 'false',
            variant: 'container',
          },
          undefined,
          {
            action: 'sort',
            detail: {
              columnId: 'valueColumn',
              label: 'Value',
              position: '1',
              sortingDescending: 'true',
            },
          }
        )
      );
    });
    test('with sortingField', () => {
      const wrapper = renderTable({ sortingColumn: { sortingField: 'value' }, sortingDescending: true });
      const columnHeaders = wrapper.findColumnHeaders();
      const element = columnHeaders[0]!.getElement();
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toEqual(
        getMetadata(
          {
            selectedItemsCount: '0',
            selectionType: 'none',
            sortingColumnId: 'valueColumn',
            sortingDescending: 'true',
            variant: 'container',
          },
          undefined,
          {
            action: 'sort',
            detail: {
              columnId: 'valueColumn',
              label: 'Value',
              position: '1',
              sortingDescending: 'false',
            },
          }
        )
      );
    });
    test('with sortingField', () => {
      const wrapper = renderTable({ sortingDisabled: true });
      const columnHeaders = wrapper.findColumnHeaders();
      const element = columnHeaders[0]!.getElement();
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toEqual(
        getMetadata({
          selectedItemsCount: '0',
          selectionType: 'none',
          variant: 'container',
        })
      );
    });
  });
});

test('Internal RadioGroup does not render "component" metadata', () => {
  const renderResult = render(<InternalTable items={items} columnDefinitions={columnDefinitions} />);
  const element = createWrapper(renderResult.container).findTable()!.findBodyCell(1, 1)!.getElement();
  validateComponentNameAndLabels(element, labels);
  const generatedMetadata = getGeneratedAnalyticsMetadata(element);
  expect(generatedMetadata.contexts).toBeUndefined();
});

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import ButtonDropdown from '../../../lib/components/button-dropdown';
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
  {
    id: 'actions',
    header: 'Actions',
    cell: () => (
      <ButtonDropdown
        items={[
          { text: 'Delete', id: 'rm', disabled: false },
          { text: 'Move', id: 'mv', disabled: false },
        ]}
        variant="inline-icon"
        ariaLabel="Control instance"
      />
    ),
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
      header={
        typeof props.header !== 'undefined' ? (
          props.header
        ) : (
          <Header variant="h2" counter="2" info="Info">
            {componentLabel}
          </Header>
        )
      }
      isItemDisabled={isItemDisabled}
    />
  );
  return createWrapper(renderResult.container).findTable()!;
}

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Table renders correct analytics metadata', () => {
  describe('selection', () => {
    test('multiple', () => {
      const wrapper = renderTable({ selectionType: 'multi', selectedItems: [items[2]], variant: 'full-page' });

      const firstSelectionArea = wrapper.findRowSelectionArea(1)!.find('input')!.getElement();
      validateComponentNameAndLabels(firstSelectionArea, labels);
      expect(getGeneratedAnalyticsMetadata(firstSelectionArea)).toMatchSnapshot();

      const disabledSelectionArea = wrapper.findRowSelectionArea(2)!.find('input')!.getElement();
      validateComponentNameAndLabels(disabledSelectionArea, labels);
      expect(getGeneratedAnalyticsMetadata(disabledSelectionArea)).toMatchSnapshot();

      const thirdSelectionArea = wrapper.findRowSelectionArea(3)!.find('input')!.getElement();
      validateComponentNameAndLabels(thirdSelectionArea, labels);
      expect(getGeneratedAnalyticsMetadata(thirdSelectionArea)).toMatchSnapshot();

      const selectAllArea = wrapper.findSelectAllTrigger()!.find('input')!.getElement();
      validateComponentNameAndLabels(selectAllArea, labels);
      expect(getGeneratedAnalyticsMetadata(selectAllArea)).toMatchSnapshot();
    });
    test('multiple with all items selected', () => {
      const wrapper = renderTable({ selectionType: 'multi', selectedItems: items });

      const selectAllArea = wrapper.findSelectAllTrigger()!.find('input')!.getElement();
      validateComponentNameAndLabels(selectAllArea, labels);
      expect(getGeneratedAnalyticsMetadata(selectAllArea)).toMatchSnapshot();
    });
    test('single', () => {
      const wrapper = renderTable({ selectionType: 'single', selectedItems: [items[2]] });

      const firstSelectionArea = wrapper.findRowSelectionArea(1)!.find('input')!.getElement();
      validateComponentNameAndLabels(firstSelectionArea, labels);
      expect(getGeneratedAnalyticsMetadata(firstSelectionArea)).toMatchSnapshot();

      const disabledSelectionArea = wrapper.findRowSelectionArea(2)!.find('input')!.getElement();
      validateComponentNameAndLabels(disabledSelectionArea, labels);
      expect(getGeneratedAnalyticsMetadata(disabledSelectionArea)).toMatchSnapshot();
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
        expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
      });
    });
  });
  describe('sorting', () => {
    test('with sortingComparator', () => {
      const wrapper = renderTable({ sortingColumn: { sortingComparator } });
      const columnHeaders = wrapper.findColumnHeaders();
      const element = columnHeaders[0]!.getElement();
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
    });
    test('with sortingField', () => {
      const wrapper = renderTable({ sortingColumn: { sortingField: 'value' }, sortingDescending: true });
      const columnHeaders = wrapper.findColumnHeaders();
      const element = columnHeaders[0]!.getElement();
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
    });
    test('with sortingDisabled', () => {
      const wrapper = renderTable({ sortingDisabled: true });
      const columnHeaders = wrapper.findColumnHeaders();
      const element = columnHeaders[0]!.getElement();
      validateComponentNameAndLabels(element, labels);
      expect(getGeneratedAnalyticsMetadata(element)).toMatchSnapshot();
    });
  });
  describe('table without header', () => {
    test('parses table label as an empty string', () => {
      const wrapper = renderTable({ header: null });
      const actionButton = wrapper.findBodyCell(1, 3)!.findButtonDropdown()!.getElement();
      expect(getGeneratedAnalyticsMetadata(actionButton)).toMatchSnapshot();
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

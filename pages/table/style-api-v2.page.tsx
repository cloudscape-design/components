// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import clsx from 'clsx';

import { Checkbox, FormField, Header, Select, SpaceBetween, Table, TableProps } from '~components';
import { StyleClassNames } from '~components/table/style-api';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { generateItems, Instance, InstanceState } from './generate-data';
import { columnsConfig } from './shared-configs';

import styles from './style-api-v2.scss';

interface Settings {
  selectionType: 'none' | TableProps.SelectionType;
  stickyColumnsFirst: string;
  stickyColumnsLast: string;
  statusHighlight: 'none' | 'cells' | 'rows';
  nestedRowsHighlight: boolean;
  multiSort: boolean;
}

type PageContext = React.Context<AppContextType<Partial<Settings>>>;

const allItems = generateItems(30);
const rootItems = allItems.slice(0, 10);
// Four root items have five children each; the first one is expanded by default.
const parentItems = [0, 1, 3, 5].map(index => rootItems[index]);
const itemChildren = new Map(
  parentItems.map((item, index) => [item, allItems.slice(10 + index * 5, 15 + index * 5)] as const)
);
const nestedItems = new Set([...itemChildren.values()].flat());

const columnDefinitions = columnsConfig.map(column => ({ ...column, minWidth: 200 }));
const instanceColumns = ['id', 'type', 'state'];
const networkColumns = ['dnsName', 'imageId'];
const columnGroups = new Map([
  ...instanceColumns.map(id => [id, 'instance'] as const),
  ...networkColumns.map(id => [id, 'network'] as const),
]);
const groupDefinitions: TableProps.GroupDefinition<Instance>[] = [
  { id: 'instance', header: 'Instance' },
  { id: 'network', header: 'Network' },
];
const columnDisplay: TableProps.ColumnDisplayProperties[] = [
  {
    type: 'group',
    id: 'instance',
    visible: true,
    children: instanceColumns.map(id => ({ id, visible: true })),
  },
  {
    type: 'group',
    id: 'network',
    visible: true,
    children: networkColumns.map(id => ({ id, visible: true })),
  },
];

const ariaLabels: TableProps.AriaLabels<Instance> = {
  selectionGroupLabel: 'Items selection',
  allItemsSelectionLabel: () => 'Select all',
  itemSelectionLabel: (_, item) => `Select ${item.id}`,
  expandButtonLabel: () => 'Expand',
  collapseButtonLabel: () => 'Collapse',
};

const selectionTypeOptions = ['none', 'single', 'multi'].map(value => ({ value }));
const stickyColumnsOptions = ['0', '1', '2'].map(value => ({ value }));
const statusHighlightOptions = ['none', 'cells', 'rows'].map(value => ({ value }));

const statuses: Partial<Record<InstanceState, string>> = {
  RUNNING: 'running',
  STOPPING: 'transitioning',
  STOPPED: 'stopped',
  TERMINATING: 'transitioning',
  TERMINATED: 'terminated',
};

export default function () {
  const {
    urlParams: {
      selectionType = 'multi',
      stickyColumnsFirst = '1',
      stickyColumnsLast = '0',
      statusHighlight = 'cells',
      nestedRowsHighlight = true,
      multiSort = false,
    },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  const [selectedItems, setSelectedItems] = useState<Instance[]>([rootItems[2], rootItems[4]]);
  const [expandedItems, setExpandedItems] = useState<Instance[]>([parentItems[0]]);
  // Single-column sort uses the first entry.
  const [sortingColumns, setSortingColumns] = useState<ReadonlyArray<TableProps.SortingState<Instance>>>([
    { sortingColumn: columnDefinitions[1] },
  ]);

  const items = [...rootItems].sort((a, b) => {
    for (const { sortingColumn, isDescending } of sortingColumns) {
      const field = sortingColumn.sortingField as keyof Instance;
      const result = String(a[field]).localeCompare(String(b[field]));
      if (result !== 0) {
        return isDescending ? -result : result;
      }
    }
    return 0;
  });

  const booleanSetting = (key: keyof Settings, label: string, checked: boolean) => (
    <Checkbox checked={checked} onChange={({ detail }) => setUrlParams({ [key]: detail.checked })}>
      {label}
    </Checkbox>
  );
  const selectSetting = (key: keyof Settings, label: string, value: string, options: { value: string }[]) => (
    <FormField label={label}>
      <Select
        selectedOption={{ value }}
        options={options}
        onChange={({ detail }) => setUrlParams({ [key]: detail.selectedOption.value })}
        ariaLabel={label}
      />
    </FormField>
  );

  const statusClassName = (item: Instance, slot: 'row' | 'cell') =>
    statuses[item.state] && styles[`status-${statuses[item.state]}-${slot}`];

  const isItemDisabled = (item: Instance) => item.state === 'TERMINATING' || item.state === 'STOPPING';
  // Mirrors the table: no selection without a selection type, and only the first item in single selection.
  const isItemSelected = (item: Instance) =>
    selectionType !== 'none' && (selectionType === 'single' ? selectedItems[0] === item : selectedItems.includes(item));

  // Selected rows keep the selection color: status and nested highlights skip them.
  const styleClassNames: StyleClassNames<Instance> = {
    root: styles.table,
    headerCell: args => {
      if (args.type === 'selection') {
        return clsx(styles['header-cell'], selectedItems.length > 0 && styles['select-all-selected']);
      }
      const groupId = args.type === 'group' ? args.group.id : columnGroups.get(args.column.id ?? '');
      return groupId ? styles[`${groupId}-header-cell`] : styles['header-cell'];
    },
    sortingButton: styles['sorting-button'],
    sortingIndicator: styles['sorting-indicator'],
    sortingMenu: { trigger: styles['sorting-menu-trigger'] },
    clearSortButton: styles['clear-sort-button'],
    row: ({ item, selected }) =>
      clsx(
        styles.row,
        isItemDisabled(item) && styles['row-disabled'],
        selected
          ? styles['row-selected']
          : (statusHighlight === 'rows' && statusClassName(item, 'row')) ||
              (nestedRowsHighlight && nestedItems.has(item) && styles['row-nested'])
      ),
    cell: args =>
      clsx(
        styles.cell,
        statusHighlight === 'cells' &&
          args.type === 'data' &&
          args.column.id === 'state' &&
          !isItemSelected(args.item) &&
          statusClassName(args.item, 'cell')
      ),
    selectionCheckbox: { control: styles.checkbox },
    selectionRadio: { control: styles.radio },
  };

  return (
    <SimplePage
      title="Table - Style API v2"
      screenshotArea={{}}
      i18n={{}}
      settings={
        <SpaceBetween size="m">
          <SpaceBetween size="m" direction="horizontal" alignItems="end">
            {selectSetting('selectionType', 'Selection type', selectionType, selectionTypeOptions)}
            {selectSetting('stickyColumnsFirst', 'Sticky columns first', stickyColumnsFirst, stickyColumnsOptions)}
            {selectSetting('stickyColumnsLast', 'Sticky columns last', stickyColumnsLast, stickyColumnsOptions)}
            {selectSetting('statusHighlight', 'Highlight status', statusHighlight, statusHighlightOptions)}
          </SpaceBetween>
          <SpaceBetween size="m" direction="horizontal">
            {booleanSetting('nestedRowsHighlight', 'Highlight nested rows', nestedRowsHighlight)}
            {booleanSetting('multiSort', 'Multi-column sort', multiSort)}
          </SpaceBetween>
        </SpaceBetween>
      }
    >
      <Table
        enableKeyboardNavigation={true}
        header={<Header counter={`(${items.length})`}>Instances</Header>}
        variant="embedded"
        items={items}
        columnDefinitions={columnDefinitions}
        groupDefinitions={groupDefinitions}
        columnDisplay={columnDisplay}
        trackBy="id"
        ariaLabels={ariaLabels}
        resizableColumns={true}
        stickyHeader={true}
        stickyColumns={{ first: +stickyColumnsFirst, last: +stickyColumnsLast }}
        selectionType={selectionType === 'none' ? undefined : selectionType}
        selectedItems={selectedItems}
        onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
        isItemDisabled={isItemDisabled}
        multiColumnSort={
          multiSort ? { sortingColumns, onChange: ({ detail }) => setSortingColumns(detail.sortingColumns) } : undefined
        }
        sortingColumn={multiSort ? undefined : sortingColumns[0]?.sortingColumn}
        sortingDescending={sortingColumns[0]?.isDescending}
        onSortingChange={({ detail }) => setSortingColumns([detail])}
        expandableRows={{
          getItemChildren: item => itemChildren.get(item) ?? [],
          isItemExpandable: item => itemChildren.has(item),
          expandedItems,
          onExpandableItemToggle: ({ detail }) =>
            setExpandedItems(prev =>
              detail.expanded ? [...prev, detail.item] : prev.filter(item => item !== detail.item)
            ),
        }}
        {...{ styleClassNames }}
      />
    </SimplePage>
  );
}

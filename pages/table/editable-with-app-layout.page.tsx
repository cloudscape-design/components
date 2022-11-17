// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import Input from '~components/input';
import Select from '~components/select';
import Table, { TableProps } from '~components/table';
import BreadcrumbGroup from '~components/breadcrumb-group';
import { initialItems, Metric } from './editable-data';
import { ColorPicker, HelpContent } from './editable-utils';

/*!
  TODO:
  1. Focus behavior- arrow navigation
  1. Extend space for the error message (visual bug) (issue)
  1. Remove flash bar after submission
  1. Show modal when exiting with unsaved changes
  ~~  1. Hide cancel button when submission is in progress ~~
  ~~  1. focus cell after cancel/submit ~~
  ~~  1. Visual changes~~
  ~~  1. Focus outline all around cell~~
  ~~  1. Replace "editable" text with icon in column header~~
*/

export const ariaLabels: TableProps.AriaLabels<Metric> = {
  // selectionGroupLabel: 'group label',
  // allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} item selected`,
  // itemSelectionLabel: ({ selectedItems }, item) =>
  //   `${item.text} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
  tableLabel: 'Items',
  activateEditLabel: column => `Edit ${column.header}`,
  cancelEditLabel: column => `Cancel editing ${column.header}`,
  submitEditLabel: column => `Submit edit ${column.header}`,
};

const DNS_NAME = /^(([a-z\d]|[a-z\d][a-z\d-]*[a-z\d])\.)*([a-z\d]|[a-z\d][a-z\d-]*[a-z\d])$/i;

const columns: Array<TableProps.ColumnDefinition<Metric, string>> = [
  {
    id: 'color',
    header: 'Color',
    width: 140,
    editConfig: {
      ariaLabel: 'Choose a color',
      errorIconAriaLabel: 'Error',
    },
    cell(item, { isEditing, currentValue, setValue }) {
      if (!isEditing) {
        return <div style={{ background: item.color, width: 16, height: 16 }}></div>;
      }
      return <ColorPicker value={currentValue ?? item.color} onChange={event => setValue(event.currentTarget.value)} />;
    },
  },
  {
    id: 'label',
    header: 'Label',
    width: 200,
    sortingField: 'label',
    editConfig: {
      ariaLabel: 'Enter a label',
      errorIconAriaLabel: 'Error',
      validation(item, value) {
        const currentValue = value ?? item.label;
        if (!currentValue.match(DNS_NAME)) {
          return 'The value should only include DNS-safe characters';
        }
        if (errorsMeta.get(item)) {
          return errorsMeta.get(item);
        }
      },
    },
    cell: (item, { isEditing, currentValue, setValue }: TableProps.CellContext<string>) => {
      if (!isEditing) {
        return item.label;
      }
      return (
        <Input autoFocus={true} value={currentValue ?? item.label} onChange={event => setValue(event.detail.value)} />
      );
    },
  },
  {
    id: 'expression',
    header: 'Expression',
    editConfig: {
      ariaLabel: 'Enter an expression',
      errorIconAriaLabel: 'Error',
      validation(item) {
        if (errorsMeta.get(item)) {
          return errorsMeta.get(item);
        }
      },
    },
    cell: (item, { isEditing, currentValue, setValue }: TableProps.CellContext<string>) => {
      if (!isEditing) {
        return item.expression;
      }
      return (
        <Input
          autoFocus={true}
          value={currentValue ?? item.expression}
          onChange={event => setValue(event.detail.value)}
        />
      );
    },
  },
  {
    header: 'Activated',
    width: 180,
    cell: (item: Metric) => {
      return item.enabled ? 'Yes' : 'No';
    },
  },
  {
    header: 'Statistic',
    cell(item) {
      return item.statistic;
    },
  },
  {
    header: 'Period',
    cell: (item: Metric) => (
      <Select
        selectedOption={{ value: item.period }}
        expandToViewport={true}
        onChange={() => {}}
        empty="Editable selects are not in the scope"
        options={[]}
      />
    ),
  },
];

let errorsMeta = new WeakMap<Metric, string>();

function Demo() {
  const [items, setItems] = useState(initialItems);
  const tableRef = useRef<TableProps.Ref>(null);

  const handleSubmit: TableProps.SubmitEditFunction<Metric> = async (currentItem, column, newValue: string) => {
    await new Promise(r => setTimeout(r, 1000));
    errorsMeta.delete(currentItem);
    if (newValue === 'inline') {
      errorsMeta.set(currentItem, 'Server does not accept this value, try another');
      throw new Error('Inline error');
    }
    const newItem = { ...currentItem, [column.id as keyof Metric]: newValue };
    setItems(items => items.map(item => (item === currentItem ? newItem : item)));
  };

  return (
    <Table
      variant="full-page"
      stickyHeader={true}
      ref={tableRef}
      header={
        <Header variant="awsui-h1-sticky" counter={`(${items.length})`}>
          Metrics
        </Header>
      }
      submitEdit={handleSubmit}
      onEditCancel={() => {
        errorsMeta = new WeakMap();
      }}
      columnDefinitions={columns}
      items={items}
      resizableColumns={true}
      ariaLabels={ariaLabels}
    />
  );
}

export default function () {
  return (
    <AppLayout
      contentType="table"
      navigationHide={true}
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'AWS-UI Demos', href: '#' },
            { text: 'Editable table', href: '#' },
          ]}
        />
      }
      tools={<HelpContent />}
      content={<Demo />}
    />
  );
}

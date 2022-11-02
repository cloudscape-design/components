// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, Dispatch, useContext, useRef, useState } from 'react';
import AppLayout from '~components/app-layout';
import FormField from '~components/form-field/internal';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import Header from '~components/header';
import Input from '~components/input';
import Select from '~components/select';
import Table, { TableProps } from '~components/table';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Button from '~components/button';
import { initialItems, Metric } from './editable-data';
import { ColorPicker, HelpContent } from './editable-utils';

/*!
  TODO:
  1. Focus behavior
    1. arrow navigation
    1. focus cell after cancel/submit
  1. Hide cancel button when submission is in progress
  1. Keep pagination and filter features when editing cell
  1. Replace "editable" text with icon in column header
  1. Extend space for the error message (visual bug)
  1. Remove flash bar after submission
  1. Handle active sorting when submitting (render a snapshot and a button to resort)
  1. Visual changes
    1. Focus outline all around cell
    1. Add borders
  1. Show modal when exiting with unsaved changes
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

type Notifications = ReadonlyArray<FlashbarProps.MessageDefinition>;
const NotificationsContext = createContext<[Notifications, Dispatch<Notifications>]>([[], () => {}]);

const DNS_NAME = /^(([a-z\d]|[a-z\d][a-z\d-]*[a-z\d])\.)*([a-z\d]|[a-z\d][a-z\d-]*[a-z\d])$/i;

const columns: Array<TableProps.ColumnDefinition<Metric>> = [
  {
    id: 'color',
    header: 'Color (editable)',
    width: 140,
    editable: true,
    cell(item, { isEditing, currentValue, setValue }) {
      if (!isEditing) {
        return <div style={{ background: item.color, width: 16, height: 16 }}></div>;
      }
      return <ColorPicker value={currentValue ?? item.color} onChange={event => setValue(event.currentTarget.value)} />;
    },
  },
  {
    id: 'label',
    header: 'Label (editable)',
    width: 200,
    editable: true,
    sortingField: 'label',
    cell: (item, { isEditing, currentValue, setValue }: TableProps.CellContext<string>) => {
      if (!isEditing) {
        return item.label;
      }
      const value = currentValue ?? item.label;
      const errorText = !value.match(DNS_NAME)
        ? 'The value should only include DNS-safe characters'
        : errorsMeta.get(item);
      return (
        <FormField __hideLabel={true} stretch={true} errorText={errorText}>
          <Input autoFocus={true} value={value} onChange={event => setValue(event.detail.value)} />
        </FormField>
      );
    },
  },
  {
    id: 'expression',
    header: 'Expression (editable)',
    editable: true,
    cell: (item, { isEditing, currentValue, setValue }: TableProps.CellContext<string>) => {
      if (!isEditing) {
        return item.expression;
      }
      const errorText = errorsMeta.get(item);
      return (
        <FormField __hideLabel={true} stretch={true} errorText={errorText}>
          <Input
            autoFocus={true}
            value={currentValue ?? item.expression}
            onChange={event => setValue(event.detail.value)}
          />
        </FormField>
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
    cell: (item: Metric) => item.statistic,
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
  const [, setNotifications] = useContext(NotificationsContext);
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
    if (newValue === 'alert') {
      throw new Error('Validation error');
    }
    setItems(items => items.map(item => (item === currentItem ? newItem : item)));
  };

  function wrapWithErrorHandler<T extends (...args: any[]) => void | Promise<any>>(callback: T): T {
    return ((...args) => {
      setNotifications([]);
      return callback(...args)?.catch(error => {
        if (error.message === 'Validation error') {
          setNotifications([
            {
              type: 'error',
              content: 'Resolve your cell edit before continuing',
              action: (
                <Button
                  onClick={() => {
                    tableRef.current?.cancelEdit?.();
                    setNotifications([]);
                  }}
                >
                  Discard change and continue
                </Button>
              ),
            },
          ]);
        }
        throw error;
      });
    }) as T;
  }
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
      submitEdit={wrapWithErrorHandler(handleSubmit)}
      onEditCancel={() => {
        setNotifications([]);
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
  const flashbarState = useState<Notifications>([]);
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
      stickyNotifications={true}
      notifications={<Flashbar items={flashbarState[0]} />}
      tools={<HelpContent />}
      content={
        <NotificationsContext.Provider value={flashbarState}>
          <Demo />
        </NotificationsContext.Provider>
      }
    />
  );
}

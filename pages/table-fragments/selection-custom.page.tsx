// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import { ColumnLayout, Container, ContentLayout, FormField, Header, Link, Select } from '~components';
import { SelectionControl, focusMarkers, useSelectionFocusMove, useSelection } from '~components/table/selection';
import styles from './styles.scss';
import { generateItems, Instance } from '../table/generate-data';
import AppContext, { AppContextType } from '../app/app-context';
import ScreenreaderOnly from '~components/internal/components/screenreader-only';
import clsx from 'clsx';

type PageContext = React.Context<
  AppContextType<{
    selectionType: 'single' | 'multi';
  }>
>;

const items = generateItems(25);

const selectionTypeOptions = [{ value: 'single' }, { value: 'multi' }];

export default function Page() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const selectionType = urlParams.selectionType ?? 'single';

  const [selectedItems, setSelectedItems] = useState<Instance[]>([]);
  const { getSelectAllProps, getItemSelectionProps, updateShiftToggle } = useSelection({
    items,
    selectedItems,
    selectionType,
    onSelectionChange: event => setSelectedItems(event.detail.selectedItems),
    ariaLabels: {
      selectionGroupLabel: 'group label',
      allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} item selected`,
      itemSelectionLabel: ({ selectedItems }, item) =>
        `${item.id} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
    },
  });

  const { moveFocusDown, moveFocusUp, moveFocus } = useSelectionFocusMove(selectionType, items.length);

  const columnDefinitions = [
    {
      key: 'selection',
      header:
        selectionType === 'multi' ? (
          <SelectionControl
            onFocusDown={event => moveFocus?.(event.target as HTMLElement, -1, +1)}
            {...getSelectAllProps()}
          />
        ) : (
          <ScreenreaderOnly>selection cell</ScreenreaderOnly>
        ),
      cell: (item: Instance) => (
        <SelectionControl
          onFocusDown={moveFocusDown}
          onFocusUp={moveFocusUp}
          onShiftToggle={updateShiftToggle}
          {...getItemSelectionProps(item)}
        />
      ),
    },
    {
      key: 'id',
      header: 'ID',
      cell: (item: Instance) => item.id,
    },
    {
      key: 'imageId',
      header: 'Image ID',
      cell: (item: Instance) => <Link>{item.imageId}</Link>,
    },
    {
      key: 'state',
      header: 'State',
      cell: (item: Instance) => item.state,
    },
    { key: 'dnsName', header: 'DNS name', cell: (item: Instance) => item.dnsName ?? '?' },
    { key: 'type', header: 'Type', cell: (item: Instance) => item.type },
  ];

  return (
    <ContentLayout header={<Header variant="h1">Rows selection with a custom table</Header>}>
      <Container
        disableContentPaddings={true}
        header={
          <ColumnLayout columns={3}>
            <FormField label="Table role">
              <Select
                data-testid="selection-type"
                options={selectionTypeOptions}
                selectedOption={selectionTypeOptions.find(option => option.value === selectionType) ?? null}
                onChange={event =>
                  setUrlParams({ selectionType: event.detail.selectedOption.value as 'single' | 'multi' })
                }
              />
            </FormField>
          </ColumnLayout>
        }
        {...focusMarkers.root}
      >
        <div className={styles['custom-table']}>
          <table className={styles['custom-table-table']} role="grid">
            <thead>
              <tr {...focusMarkers.all}>
                {columnDefinitions.map(column => (
                  <th
                    key={column.key}
                    className={clsx(
                      styles['custom-table-cell'],
                      column.key === 'selection' && styles['custom-table-selection-cell']
                    )}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} {...focusMarkers.item} data-rowindex={index + 1}>
                  {columnDefinitions.map(column => (
                    <td key={column.key} className={styles['custom-table-cell']}>
                      {column.cell(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </ContentLayout>
  );
}

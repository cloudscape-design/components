// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import { range } from 'lodash';

import {
  Box,
  Button,
  Checkbox,
  Container,
  ExpandableSection,
  FormField,
  Header,
  Input,
  Link,
  Slider,
  SpaceBetween,
  StatusIndicator,
  Table,
  TableProps,
} from '~components';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';

type PageContext = React.Context<
  AppContextType<{
    wrapLines?: boolean;
    verticalAlignTop?: boolean;
    sortingDisabled?: boolean;
    resizableColumns?: boolean;
    isExpandable?: boolean;
    isExpanded?: boolean;
    isEditable?: boolean;
    stripedRows?: boolean;
    hasSelection?: boolean;
    multiSelection?: boolean;
    hasFooter?: boolean;
    stickyColumnsFirst?: string;
    stickyColumnsLast?: string;
    tableEmpty?: boolean;
    tableLoading?: boolean;
  }>
>;

const columns = range(0, 10).map(index => index + 1);

export default function InlineEditorPermutations() {
  const { settings, setUrlParams } = usePageSettings();
  return (
    <Box margin="m">
      <h1>Table cell permutations</h1>

      <ScreenshotArea gutters={false} disableAnimations={true}>
        <ExpandableSection variant="stacked" headerText="Settings" headingTagOverride="h2" defaultExpanded={true}>
          <SpaceBetween size="m">
            <SpaceBetween size="m" direction="horizontal" alignItems="center">
              <Checkbox
                checked={settings.wrapLines}
                onChange={event => setUrlParams({ wrapLines: event.detail.checked })}
              >
                Wrap lines
              </Checkbox>

              <Checkbox
                checked={settings.isExpandable}
                onChange={event => setUrlParams({ isExpandable: event.detail.checked })}
              >
                Is expandable
              </Checkbox>

              <Checkbox
                checked={settings.isExpanded}
                onChange={event => setUrlParams({ isExpanded: event.detail.checked })}
              >
                Is expanded
              </Checkbox>

              <Checkbox
                checked={settings.isEditable}
                onChange={event => setUrlParams({ isEditable: event.detail.checked })}
              >
                Editable
              </Checkbox>

              <Checkbox
                checked={settings.sortingDisabled}
                onChange={event => setUrlParams({ sortingDisabled: event.detail.checked })}
              >
                Sorting disabled
              </Checkbox>

              <Checkbox
                checked={settings.verticalAlign === 'top'}
                onChange={event => setUrlParams({ verticalAlignTop: event.detail.checked })}
              >
                Vertical align top
              </Checkbox>

              <Checkbox
                checked={settings.stripedRows}
                onChange={event => setUrlParams({ stripedRows: event.detail.checked })}
              >
                Striped rows
              </Checkbox>

              <Checkbox
                checked={settings.hasSelection}
                onChange={event => setUrlParams({ hasSelection: event.detail.checked })}
              >
                Has selection
              </Checkbox>

              <Checkbox
                checked={settings.multiSelection}
                onChange={event => setUrlParams({ multiSelection: event.detail.checked })}
              >
                Multi selection
              </Checkbox>

              <Checkbox
                checked={settings.hasFooter}
                onChange={event => setUrlParams({ hasFooter: event.detail.checked })}
              >
                Has footer
              </Checkbox>

              <Checkbox
                checked={settings.resizableColumns}
                onChange={event => setUrlParams({ resizableColumns: event.detail.checked })}
              >
                Resizable columns
              </Checkbox>

              <Checkbox
                checked={settings.tableEmpty}
                onChange={event => setUrlParams({ tableEmpty: event.detail.checked })}
              >
                Table empty
              </Checkbox>

              <Checkbox
                checked={settings.tableLoading}
                onChange={event => setUrlParams({ tableLoading: event.detail.checked })}
              >
                Table loading
              </Checkbox>
            </SpaceBetween>

            <SpaceBetween size="m" direction="horizontal" alignItems="center">
              <FormField label="Sticky columns first">
                <Slider
                  value={settings.stickyColumnsFirst}
                  onChange={event => setUrlParams({ stickyColumnsFirst: event.detail.value.toString() })}
                  min={0}
                  max={3}
                />
              </FormField>

              <FormField label="Sticky columns last">
                <Slider
                  value={settings.stickyColumnsLast}
                  onChange={event => setUrlParams({ stickyColumnsLast: event.detail.value.toString() })}
                  min={0}
                  max={3}
                />
              </FormField>
            </SpaceBetween>
          </SpaceBetween>
        </ExpandableSection>

        <Container variant="stacked" header={<Header variant="h2">Actual table demo</Header>}>
          <TableCellsDemo />
        </Container>
      </ScreenshotArea>
    </Box>
  );
}

function TableCellsDemo() {
  const { settings } = usePageSettings();
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  const items = [0, 1, 2, 3, 4, 5, 6, 7];
  const itemLevels = [1, 2, 3, 4, 5, 1, 2, 3];
  const itemChildren: Record<number, number[]> = { 0: [1], 1: [2], 2: [3], 3: [4], 5: [6], 6: [7] };
  const itemLoading = new Map<null | number, TableProps.LoadingStatus>([
    [3, 'pending'],
    [6, 'error'],
    [null, 'loading'],
  ]);
  const selectedItems = [3, 5, 6];

  const columnDefinitions: TableProps.ColumnDefinition<number>[] = columns.map(index => {
    const columnId = index.toString();
    const cellRenderer = (() => {
      const getText = (item: number) =>
        editedValues[`${columnId}:${item}`] ??
        `Body cell content ${item}:${index}${index === 1 ? ` (L=${itemLevels[item]})` : ''}${index === 8 ? ' with longer text' : ''}`;
      switch (index) {
        case 1:
          return { type: 'link', getText, render: (item: number) => <Link>{getText(item)}</Link> };
        case 3:
          return {
            type: 'status',
            getText,
            render: (item: number) => <StatusIndicator>{getText(item)}</StatusIndicator>,
          };
        case 4:
          return { type: 'right-align', getText, render: () => <Box textAlign="right">{index}</Box> };
        case 10:
          return {
            type: 'actions',
            getText,
            render: () => <Button variant="icon" iconName="ellipsis" ariaLabel="Actions" />,
          };
        default:
          return { type: 'text', getText, render: getText };
      }
    })();
    return {
      id: columnId,
      header: `Header cell content ${index}${index === 8 ? ' with longer text' : ''}`,
      sortingField: index === 2 ? 'field-1' : index === 3 ? 'field-2' : undefined,
      activeSorting: index === 3,
      cell: item => cellRenderer.render(item),
      editConfig: settings.isEditable
        ? {
            ariaLabel: 'Edit dialog aria label',
            editIconAriaLabel: 'Edit icon label',
            errorIconAriaLabel: 'Edit error icon label',
            validation(_item, value = '') {
              if (value.trim() && value.toLowerCase().includes('content')) {
                return 'Must not include "content"';
              }
            },
            editingCell(item, { currentValue, setValue }: TableProps.CellContext<string>) {
              return (
                <Input
                  autoFocus={true}
                  value={currentValue ?? cellRenderer.getText(item)}
                  onChange={event => setValue(event.detail.value)}
                />
              );
            },
          }
        : undefined,
    };
  });

  let expandableRows: undefined | TableProps.ExpandableRows<number> = undefined;
  if (settings.isExpandable) {
    expandableRows = {
      getItemChildren: item => itemChildren[item] ?? [],
      isItemExpandable: item => !!itemChildren[item],
      expandedItems: settings.isExpanded ? items : [],
      onExpandableItemToggle: () => {},
    };
  }

  let selectionType: undefined | TableProps.SelectionType = undefined;
  if (settings.hasSelection) {
    selectionType = settings.multiSelection ? 'multi' : 'single';
  }

  return (
    <Table
      ariaLabels={{
        selectionGroupLabel: 'selectionGroupLabel',
        activateEditLabel: () => 'activateEditLabel',
        cancelEditLabel: () => 'cancelEditLabel',
        submitEditLabel: () => 'submitEditLabel',
        allItemsSelectionLabel: () => 'allItemsSelectionLabel',
        itemSelectionLabel: () => 'itemSelectionLabel',
        tableLabel: 'tableLabel',
        expandButtonLabel: () => 'expand row',
        collapseButtonLabel: () => 'collapse row',
      }}
      columnDefinitions={columnDefinitions}
      items={settings.tableEmpty ? [] : settings.isExpandable ? [0, 5] : items}
      wrapLines={settings.wrapLines}
      sortingDisabled={settings.sortingDisabled}
      sortingColumn={{ sortingField: 'field-2' }}
      resizableColumns={settings.resizableColumns}
      stripedRows={settings.stripedRows}
      footer={settings.hasFooter ? <Box>Table footer</Box> : null}
      stickyColumns={{ first: settings.stickyColumnsFirst, last: settings.stickyColumnsLast }}
      selectionType={selectionType}
      selectedItems={selectedItems}
      cellVerticalAlign={settings.verticalAlign}
      empty="Empty"
      loading={settings.tableLoading}
      loadingText="Loading"
      submitEdit={(item, column, newValue) =>
        new Promise(resolve =>
          resolve(setEditedValues(prev => ({ ...prev, [`${column.id}:${item}`]: newValue as string })))
        )
      }
      expandableRows={expandableRows}
      getLoadingStatus={item => itemLoading.get(item) ?? 'finished'}
      renderLoaderPending={() => <Button>Load more</Button>}
      renderLoaderLoading={() => <StatusIndicator type="loading">Loading more</StatusIndicator>}
      renderLoaderError={() => <StatusIndicator type="error">Error when loading more</StatusIndicator>}
    />
  );
}

function usePageSettings() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const settings = {
    isExpandable: urlParams.isExpandable ?? false,
    isExpanded: urlParams.isExpanded ?? false,
    isEditable: urlParams.isEditable ?? false,
    sortingDisabled: urlParams.sortingDisabled ?? false,
    resizableColumns: urlParams.resizableColumns ?? true,
    wrapLines: urlParams.wrapLines ?? false,
    stripedRows: urlParams.stripedRows ?? false,
    hasSelection: urlParams.hasSelection ?? true,
    multiSelection: urlParams.multiSelection ?? true,
    hasFooter: urlParams.hasFooter ?? false,
    verticalAlign: (urlParams.verticalAlignTop ? 'top' : 'middle') as 'top' | 'middle',
    stickyColumnsFirst: parseInt(urlParams.stickyColumnsFirst ?? '') || 0,
    stickyColumnsLast: parseInt(urlParams.stickyColumnsLast ?? '') || 0,
    tableEmpty: urlParams.tableEmpty ?? false,
    tableLoading: urlParams.tableLoading ?? false,
  };
  return { settings, setUrlParams };
}

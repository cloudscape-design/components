// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';
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
  Slider,
  SpaceBetween,
  StatusIndicator,
  TableProps,
} from '~components';
import { useMergeRefs } from '~components/internal/hooks/use-merge-refs';
import { TableBodyCell, TableBodyCellProps } from '~components/table/body-cell';
import { TableHeaderCell, TableHeaderCellProps } from '~components/table/header-cell';
import { NoDataCell } from '~components/table/no-data-cell';
import { TableLoaderCell, TableLoaderCellProps } from '~components/table/progressive-loading/loader-cell';
import { TableBodySelectionCell, TableHeaderSelectionCell } from '~components/table/selection/selection-cell';
import { StickyColumnsModel, useStickyColumns } from '~components/table/sticky-columns';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';

type PageContext = React.Context<
  AppContextType<{
    wrapLines?: boolean;
    verticalAlignTop?: boolean;
    sortingDisabled?: boolean;
    resizableColumns?: boolean;
    resizableColumnWidth?: string;
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

      <ScreenshotArea gutters={false}>
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
              <FormField label="Resizable column width">
                <Slider
                  value={settings.resizableColumnWidth}
                  onChange={event => setUrlParams({ resizableColumnWidth: event.detail.value.toString() })}
                  min={50}
                  max={300}
                />
              </FormField>

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

        <Container variant="stacked" header={<Header variant="h2">Standard cells</Header>}>
          <StandardCellsTable />
        </Container>
      </ScreenshotArea>
    </Box>
  );
}

function StandardCellsTable() {
  const { settings } = usePageSettings();
  const containerRefObject = useRef<HTMLDivElement>(null);
  const containerRef = useMergeRefs(containerRefObject, settings.stickyState.refs.wrapper);
  const tableRefObject = useRef<HTMLTableElement>(null);
  const tableRef = useMergeRefs(tableRefObject, settings.stickyState.refs.table);
  return (
    <div ref={containerRef} style={{ overflowX: 'auto', ...settings.stickyState.style.wrapper }}>
      <table ref={tableRef} style={{ tableLayout: 'fixed', borderSpacing: 0, width: '100%' }}>
        <thead>
          <TextHeaders {...settings} />
        </thead>
        <tbody>
          {settings.tableEmpty || settings.tableLoading ? (
            <tr>
              <NoDataCell
                totalColumnsCount={columns.length}
                hasFooter={settings.hasFooter}
                loading={settings.tableLoading}
                loadingText="Loading"
                empty="Empty"
                containerRef={containerRefObject}
                tableRef={tableRefObject}
              />
            </tr>
          ) : (
            <>
              <TextColumns {...settings} level={1} isEvenRow={false} isFirstRow={true} />
              <TextColumns {...settings} level={2} isEvenRow={true} />
              <TextColumns {...settings} level={3} isEvenRow={false} isNextSelected={true} />
              <TextColumns {...settings} level={4} isEvenRow={true} isSelected={true} />
              <TextColumns {...settings} level={5} isEvenRow={false} isPrevSelected={true} isNextSelected={true} />
              <TextColumns {...settings} level={1} isEvenRow={true} isSelected={true} isNextSelected={true} />
              <TextColumns {...settings} level={2} isEvenRow={false} isSelected={true} isPrevSelected={true} />
              <TextColumns {...settings} level={3} isEvenRow={true} isPrevSelected={true} />
              <LoaderColumns {...settings} level={3} isEvenRow={false} loadingStatus="pending" />
              <LoaderColumns {...settings} level={2} isEvenRow={false} loadingStatus="loading" />
              <LoaderColumns {...settings} level={1} isEvenRow={false} isLastRow={true} loadingStatus="error" />
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

function TextHeaders(
  props: Partial<TableHeaderCellProps<string>> & {
    stickyState: StickyColumnsModel;
    resizableColumnWidth?: number;
    isExpandable?: boolean;
    hasSelection?: boolean;
    multiSelection?: boolean;
  }
) {
  return (
    <tr>
      {props.hasSelection && (
        <TableHeaderSelectionCell
          {...defaultCellProps()}
          {...props}
          onFocusMove={() => {}}
          columnId="selection"
          getSelectAllProps={
            props.multiSelection
              ? () => ({
                  name: 'select-all',
                  disabled: false,
                  selectionType: 'multi',
                  indeterminate: true,
                  checked: false,
                  onChange: () => {},
                })
              : undefined
          }
        />
      )}
      {columns.map(index => (
        <PlaygroundHeaderCell
          key={index}
          {...props}
          colIndex={index}
          isExpandable={index === 1 && props.isExpandable}
          sortable={[2, 3, 4, 5].includes(index)}
          activeSorting={[4, 5].includes(index)}
          sortingDescending={[3, 5].includes(index)}
        >
          {`Header cell content ${index}${index === 8 ? ' with longer text' : ''}`}
        </PlaygroundHeaderCell>
      ))}
    </tr>
  );
}

function TextColumns(
  props: Partial<TableBodyCellProps<string>> & {
    level: number;
    stickyState: StickyColumnsModel;
    isExpandable?: boolean;
    isExpanded?: boolean;
    multiSelection?: boolean;
  }
) {
  return (
    <tr>
      {props.hasSelection && (
        <TableBodySelectionCell
          {...defaultCellProps()}
          {...props}
          columnId="selection"
          isExpandable={false}
          selectionControlProps={{
            name: 'select-one',
            disabled: false,
            selectionType: props.multiSelection ? 'multi' : 'single',
            checked: !!props.isSelected,
            onChange: () => {},
          }}
        />
      )}
      {columns.map(index => (
        <PlaygroundBodyCell
          key={index}
          {...props}
          colIndex={index}
          level={index === 1 && props.isExpandable ? props.level : 0}
          isExpandable={index === 1 && props.isExpandable}
          isExpanded={index === 1 && props.isExpanded}
        >
          {`Body cell content ${index}${index === 1 ? ` (L=${props.level})` : ''}${index === 8 ? ' with longer text' : ''}`}
        </PlaygroundBodyCell>
      ))}
    </tr>
  );
}

function LoaderColumns(
  props: Partial<TableLoaderCellProps<string>> & {
    level: number;
    stickyState: StickyColumnsModel;
    loadingStatus: TableProps.LoadingStatus;
  }
) {
  return (
    <tr>
      {props.hasSelection && (
        <TableBodySelectionCell {...defaultCellProps()} {...props} columnId="selection" isExpandable={false} />
      )}
      {columns.map(index => (
        <TableLoaderCell
          {...defaultCellProps()}
          {...props}
          key={index}
          colIndex={index}
          columnId={index.toString()}
          level={index === 1 && props.isExpandable ? props.level - 1 : 0}
          isRowHeader={index === 1}
          isExpandable={false}
          isExpanded={false}
          item={''}
          renderLoaderPending={() => <Button>Load more</Button>}
          renderLoaderLoading={() => <StatusIndicator type="loading">Loading more</StatusIndicator>}
          renderLoaderError={() => <StatusIndicator type="error">Error when loading more</StatusIndicator>}
        />
      ))}
    </tr>
  );
}

function PlaygroundHeaderCell(
  props: Partial<TableHeaderCellProps<string>> & {
    children: React.ReactNode;
    colIndex: number;
    resizableColumnWidth?: number;
    stickyState: StickyColumnsModel;
    sortable?: boolean;
    activeSorting?: boolean;
  }
) {
  const column: TableProps.ColumnDefinition<string> = {
    id: props.colIndex.toString(),
    header: props.children,
    cell: () => '',
    sortingField: props.sortable ? 'field' : undefined,
  };
  return (
    <TableHeaderCell
      style={{ width: props.resizableColumns ? props.resizableColumnWidth : undefined }}
      tabIndex={-1}
      column={column}
      activeSortingColumn={props.activeSorting ? column : undefined}
      columnId={props.colIndex.toString()}
      hidden={false}
      {...defaultCellProps()}
      onResizeFinish={() => {}}
      updateColumn={() => {}}
      onClick={() => {}}
      cellRef={() => {}}
      tableRole="grid"
      {...props}
    />
  );
}

function PlaygroundBodyCell(
  props: Partial<TableBodyCellProps<string>> & {
    children: React.ReactNode;
    stickyState: StickyColumnsModel;
    colIndex: number;
    isEditable?: boolean;
  }
) {
  const [isEditing, setIsEditing] = useState(false);
  const [successfulEdit, setSuccessfulEdit] = useState(false);
  const [editedValue, setEditedValue] = useState('');
  return (
    <TableBodyCell
      ariaLabels={{
        activateEditLabel: column => `Edit ${column.header}`,
        cancelEditLabel: column => `Cancel editing ${column.header}`,
        submitEditLabel: column => `Submit edit ${column.header}`,
        successfulEditLabel: () => 'Edit successful',
      }}
      column={{
        id: props.colIndex.toString(),
        header: '',
        cell: () => editedValue || props.children,
        editConfig: {
          ariaLabel: 'Edit dialog aria label',
          editIconAriaLabel: 'Edit icon label',
          errorIconAriaLabel: 'Edit error icon label',
          validation(_item, value = '') {
            if (value.trim() && value.toLowerCase().includes('content')) {
              return 'Must not include "content"';
            }
          },
          editingCell(_item, { currentValue, setValue }: TableProps.CellContext<string>) {
            return (
              <Input
                autoFocus={true}
                value={currentValue ?? (typeof props.children === 'string' ? props.children : '')}
                onChange={event => setValue(event.detail.value)}
              />
            );
          },
        },
      }}
      isEditing={isEditing}
      successfulEdit={successfulEdit}
      onEditStart={() => setIsEditing(true)}
      onEditEnd={() => {
        setIsEditing(false);
        setSuccessfulEdit(true);
      }}
      submitEdit={(_item, _column, newValue) => new Promise(resolve => resolve(setEditedValue(newValue as any)))}
      columnId={props.colIndex.toString()}
      item={''}
      {...defaultCellProps()}
      {...props}
    />
  );
}

function defaultCellProps() {
  return {
    isFirstRow: false,
    isLastRow: false,
    isSelected: false,
    isNextSelected: false,
    isPrevSelected: false,
    wrapLines: false,
    isEditable: false,
    resizableColumns: false,
    tableRole: 'grid' as const,
    variant: 'container' as const,
  };
}

function usePageSettings() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const settings = {
    isExpandable: urlParams.isExpandable ?? false,
    isExpanded: urlParams.isExpanded ?? false,
    isEditable: urlParams.isEditable ?? false,
    sortingDisabled: urlParams.sortingDisabled ?? false,
    resizableColumns: urlParams.resizableColumns ?? true,
    resizableColumnWidth: parseInt(urlParams.resizableColumnWidth || '') || 150,
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
  const stickyState = useStickyColumns({
    visibleColumns: columns.map(index => index.toString()),
    stickyColumnsFirst: settings.stickyColumnsFirst,
    stickyColumnsLast: settings.stickyColumnsLast,
  });
  return { settings: { ...settings, stickyState }, setUrlParams };
}

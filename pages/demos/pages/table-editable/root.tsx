// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useRef, useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';
import { AppLayoutProps } from '@cloudscape-design/components/app-layout';
import Pagination, { PaginationProps } from '@cloudscape-design/components/pagination';
import SplitPanel from '@cloudscape-design/components/split-panel';
import Table, { TableProps } from '@cloudscape-design/components/table';
import TextFilter, { TextFilterProps } from '@cloudscape-design/components/text-filter';

import { Distribution } from '../../fake-server/types';
import {
  distributionEditableTableAriaLabels,
  getHeaderCounterText,
  getTextFilterCounterText,
  renderAriaLive,
} from '../../i18n-strings';
import { FullPageHeader } from '../commons';
import {
  CustomAppLayout,
  GlobalSplitPanelContent,
  Navigation,
  Notifications,
  TableEmptyState,
  TableNoMatchState,
  useGlobalSplitPanel,
} from '../commons/common-components';
import {
  DEFAULT_PREFERENCES,
  domainNameRegex,
  EDITABLE_COLUMN_DEFINITIONS,
  INVALID_DOMAIN_MESSAGE,
  Preferences,
  serverSideErrorsStore,
} from '../commons/table-config';
import { useColumnWidths } from '../commons/use-column-widths';
import { useLocalStorage } from '../commons/use-local-storage';
import { Breadcrumbs, ManualRefresh, ToolsContent } from '../table/common-components';

import '../../styles/base.scss';

const fakeDataFetch = (delay: number) => new Promise<void>(resolve => setTimeout(() => resolve(), delay));

interface TableContentProps {
  loadHelpPanelContent: () => void;
  distributions: Distribution[];
}

function TableContent({ loadHelpPanelContent, distributions }: TableContentProps) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>();
  const [tableItems, setTableItems] = useState(distributions);
  const [columnDefinitions, saveWidths] = useColumnWidths('React-TableEditable-Widths', EDITABLE_COLUMN_DEFINITIONS);
  const [preferences, setPreferences] = useLocalStorage('React-TableEditable-Preferences', DEFAULT_PREFERENCES);
  const [itemsSnap, setItemsSnap] = useState<Distribution[]>();

  const persistChanges = () => {
    setTableItems(tableItems);
    setItemsSnap(undefined);
  };

  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps, allPageItems } =
    useCollection(tableItems, {
      filtering: {
        empty: <TableEmptyState resourceName="Distribution" />,
        noMatch: <TableNoMatchState onClearFilter={() => actions.setFiltering('')} />,
      },
      pagination: { pageSize: preferences?.pageSize },
      sorting: { defaultState: { sortingColumn: columnDefinitions[0] } },
      selection: {},
    });

  const tablePaginationProps: PaginationProps = {
    ...paginationProps,
    onChange: event => {
      persistChanges();
      paginationProps.onChange(event);
    },
  };

  const tableFilterProps: TextFilterProps = {
    ...filterProps,
    onChange: event => {
      persistChanges();
      filterProps.onChange(event);
    },
  };

  const tableCollectionProps: Partial<TableProps> = {
    ...collectionProps,
    onSortingChange: event => {
      persistChanges();
      collectionProps.onSortingChange?.(event);
    },
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fakeDataFetch(500);
    persistChanges();
    setLastRefresh(new Date());
    setRefreshing(false);
  };

  useEffect(() => {
    // Demonstrates an initial fetching of the data from the backend.
    setTimeout(() => {
      setLoading(false);
      setLastRefresh(new Date());
    }, 500);
  }, []);

  const handleSubmit = async (
    currentItem: Distribution,
    column: TableProps.ColumnDefinition<Distribution>,
    value: unknown
  ) => {
    if (!column.id) {
      return;
    }

    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    let fullCollection = tableItems;

    serverSideErrorsStore.delete(currentItem);

    if (column.id === 'domainName' && !domainNameRegex.test(String(value))) {
      serverSideErrorsStore.set(currentItem, INVALID_DOMAIN_MESSAGE);
      throw new Error('Inline error');
    }

    const newItem: Distribution = { ...currentItem, [column.id]: value };

    if (collectionProps.sortingColumn === column) {
      // This call signature is not supported by the function; not sure what to do with this
      // actions.setSorting(null);
      fullCollection = [...allPageItems];
    }

    if (filterProps.filteringText) {
      fullCollection = tableItems;
    }

    if (collectionProps.sortingColumn === column || filterProps.filteringText) {
      setItemsSnap(items.map(item => (item === currentItem ? newItem : item)));
    }

    setTableItems(fullCollection.map(item => (item === currentItem ? newItem : item)));
    setSubmitting(false);
  };

  return (
    <Table
      {...tableCollectionProps}
      enableKeyboardNavigation={true}
      columnDefinitions={columnDefinitions}
      columnDisplay={preferences?.contentDisplay}
      items={itemsSnap || items}
      submitEdit={handleSubmit}
      ariaLabels={distributionEditableTableAriaLabels}
      renderAriaLive={renderAriaLive}
      variant="full-page"
      stickyHeader={true}
      resizableColumns={true}
      onColumnWidthsChange={saveWidths}
      wrapLines={preferences?.wrapLines}
      stripedRows={preferences?.stripedRows}
      contentDensity={preferences?.contentDensity}
      stickyColumns={preferences?.stickyColumns}
      selectionType="multi"
      loading={loading}
      header={
        <FullPageHeader
          selectedItemsCount={tableCollectionProps.selectedItems?.length ?? 0}
          counter={!loading ? getHeaderCounterText(distributions, tableCollectionProps.selectedItems) : undefined}
          extraActions={
            <ManualRefresh onRefresh={onRefresh} loading={refreshing} disabled={submitting} lastRefresh={lastRefresh} />
          }
          onInfoLinkClick={loadHelpPanelContent}
        />
      }
      filter={
        <TextFilter
          {...tableFilterProps}
          filteringAriaLabel="Filter distributions"
          filteringPlaceholder="Find distributions"
          filteringClearAriaLabel="Clear"
          countText={getTextFilterCounterText(filteredItemsCount ?? 0)}
          disabled={submitting}
        />
      }
      pagination={<Pagination {...tablePaginationProps} disabled={submitting} />}
      preferences={<Preferences preferences={preferences} setPreferences={setPreferences} disabled={submitting} />}
    />
  );
}

export interface AppProps {
  distributions: Distribution[];
}

export function App({ distributions }: AppProps) {
  const appLayout = useRef<AppLayoutProps.Ref>(null);
  const [toolsOpen, setToolsOpen] = useState(false);
  const { splitPanelOpen, onSplitPanelToggle, splitPanelSize, onSplitPanelResize, splitPanelPreferences } =
    useGlobalSplitPanel();

  return (
    <CustomAppLayout
      ref={appLayout}
      navigation={<Navigation activeHref="#/distributions" />}
      notifications={<Notifications />}
      breadcrumbs={<Breadcrumbs />}
      splitPanelOpen={splitPanelOpen}
      onSplitPanelToggle={onSplitPanelToggle}
      splitPanelSize={splitPanelSize}
      onSplitPanelResize={onSplitPanelResize}
      splitPanelPreferences={splitPanelPreferences}
      splitPanel={
        <SplitPanel header="Design exploration">
          <GlobalSplitPanelContent />
        </SplitPanel>
      }
      content={
        <TableContent
          distributions={distributions}
          loadHelpPanelContent={() => {
            setToolsOpen(true);
            appLayout.current?.focusToolsClose();
          }}
        />
      }
      contentType="table"
      tools={<ToolsContent />}
      toolsOpen={toolsOpen}
      onToolsChange={({ detail }) => setToolsOpen(detail.open)}
      stickyNotifications={true}
    />
  );
}

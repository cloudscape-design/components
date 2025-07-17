// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Button, PropertyFilter } from '~components';
import Header from '~components/header';
import Table from '~components/table';

import { SimplePage } from '../app/templates';
import { BulkActionModal, DataGrouping, FilterLayout } from './grouped-table/grouped-table-components';
import {
  createColumnDefinitions,
  getHeaderCounterText,
  getLoaderSelectionAriaLabel,
  getSelectionAriaLabel,
  useProgressiveLoading,
  useTransactions,
} from './grouped-table/grouped-table-config';
import { allTransactions, isGroupRow, TransactionRow } from './grouped-table/grouped-table-data';
import { getMatchesCountText, renderAriaLive } from './shared-configs';

export default () => {
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const collection = useProgressiveLoading(useTransactions(), {
    getLabel: (item: TransactionRow) => item.group,
    getCount: (item: TransactionRow) => (isGroupRow(item) ? item.transactions.length : 1),
  });
  return (
    <SimplePage title="Grouped table demo with collection hooks" i18n={{}} screenshotArea={{}}>
      <Table
        items={collection.items}
        {...collection.collectionProps}
        stickyColumns={{ first: 1 }}
        resizableColumns={true}
        columnDefinitions={createColumnDefinitions(collection)}
        ariaLabels={{
          tableLabel: 'Transactions table',
          selectionGroupLabel: 'Transactions selection',
          allItemsSelectionLabel: getSelectionAriaLabel,
          allItemsLoaderSelectionLabel: getLoaderSelectionAriaLabel,
          itemSelectionLabel: getSelectionAriaLabel,
          itemLoaderSelectionLabel: getLoaderSelectionAriaLabel,
        }}
        renderAriaLive={renderAriaLive}
        variant="borderless"
        header={
          <Header
            variant="h2"
            counter={getHeaderCounterText(allTransactions.length, collection.collectionProps.selectedItems)}
            actions={
              <Button
                variant="primary"
                disabled={collection.collectionProps.selectedItems?.length === 0}
                onClick={() => setConfirmationDialogOpen(true)}
              >
                Bulk update
              </Button>
            }
          >
            Transactions
          </Header>
        }
        filter={
          <FilterLayout
            filter={
              <PropertyFilter
                {...collection.propertyFilterProps}
                countText={getMatchesCountText(collection.filteredItemsCount ?? 0)}
                filteringPlaceholder="Search transactions"
              />
            }
            dataGrouping={<DataGrouping groups={collection.groups} onChange={collection.setGroups} />}
          />
        }
      />
      {confirmationDialogOpen && (
        <BulkActionModal
          collection={collection}
          onDismiss={() => setConfirmationDialogOpen(false)}
          onSubmit={() => {
            setConfirmationDialogOpen(false);
            collection.actions.setGroupSelection({ inverted: false, toggledItems: [] });
          }}
        />
      )}
    </SimplePage>
  );
};

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import { useCollection } from '@cloudscape-design/collection-hooks';
import Button from '~components/button';
import CollectionPreferences, { CollectionPreferencesProps } from '~components/collection-preferences';
import Header from '~components/header';
import Container from '~components/container';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import Pagination from '~components/pagination';
import Table, { TableProps } from '~components/table';
import TextFilter from '~components/text-filter';
import { Instance, generateItems } from './generate-data';
import {
  columnsConfig,
  EmptyState,
  getMatchesCountText,
  paginationLabels,
  pageSizeOptions,
  visibleContentOptions,
} from './shared-configs';

const allItems = generateItems();
const ariaLabels: TableProps<Instance>['ariaLabels'] = {
  selectionGroupLabel: 'group label',
  allItemsSelectionLabel: ({ selectedItems }) => `${selectedItems.length} item selected`,
  itemSelectionLabel: ({ selectedItems }, item) =>
    `${item.id} is ${selectedItems.indexOf(item) < 0 ? 'not ' : ''}selected`,
};

export default function App() {
  const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({
    pageSize: 20,
    visibleContent: ['id', 'type', 'dnsName', 'state'],
    wrapLines: false,

    // set to true for default striped rows.
    stripedRows: true,
    contentDensity: 'compact',
  });
  const [selectedItems, setSelectedItems] = React.useState<any>([]);

  const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
    allItems,
    {
      filtering: {
        empty: (
          <EmptyState
            title="No resources"
            subtitle="No resources to display."
            action={<Button>Create resource</Button>}
          />
        ),
        noMatch: (
          <EmptyState
            title="No matches"
            subtitle="We can’t find a match."
            action={<Button onClick={() => actions.setFiltering('')}>Clear filter</Button>}
          />
        ),
      },
      pagination: { pageSize: preferences.pageSize },
      sorting: {},
    }
  );

  return (
    <ScreenshotArea>
      <SpaceBetween size="l">
        <Container
          header={
            <Header
              variant="h2"
              headingTagOverride="h1"
              description={
                <>
                  Some additional text{' '}
                  <Link fontSize="inherit" variant="primary">
                    with a link
                  </Link>
                  .
                </>
              }
              info={<Link variant="info">Info</Link>}
            >
              Container with tag override
            </Header>
          }
        >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
          tortor, mollis vitae molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui
          tortor, mollis vitae molestie sed. Phasellus tincidunt suscipit varius.
        </Container>
        <Table<Instance>
          {...collectionProps}
          header={
            <Header headingTagOverride="h1" counter={`(${allItems.length})`}>
              Instances
            </Header>
          }
          ariaLabels={ariaLabels}
          selectionType="multi"
          onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
          selectedItems={selectedItems}
          stripedRows={preferences.stripedRows}
          contentDensity={preferences.contentDensity}
          wrapLines={preferences.wrapLines}
          columnDefinitions={columnsConfig}
          items={items}
          pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
          filter={
            <TextFilter
              {...filterProps!}
              countText={getMatchesCountText(filteredItemsCount!)}
              filteringAriaLabel="Filter instances"
            />
          }
          visibleColumns={preferences.visibleContent}
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              onConfirm={({ detail }) => setPreferences(detail)}
              preferences={preferences}
              pageSizePreference={{
                title: 'Select page size',
                options: pageSizeOptions,
              }}
              visibleContentPreference={{
                title: 'Select visible columns',
                options: visibleContentOptions,
              }}
              wrapLinesPreference={{
                label: 'Wrap lines',
                description: 'Wrap lines description',
              }}
              stripedRowsPreference={{
                label: 'Striped rows',
                description: 'Striped rows description',
              }}
              contentDensityPreference={{
                label: 'Compact mode',
                description: 'Display content in a more compact, denser mode',
              }}
            />
          }
        />
        <Container header={<Header variant="h2">Container header</Header>}>
          This container uses a semantically correct h2 in the header. Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui tortor, mollis vitae molestie sed,
          malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui tortor, mollis vitae molestie sed.
          Phasellus tincidunt suscipit varius.
        </Container>

        <Container header={<Header variant="h2">With footer</Header>} footer="Some footer text">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Phasellus tincidunt suscipit varius. Nullam dui
          tortor, mollis vitae molestie sed, malesuada.Lorem ipsum dolor sit amet, consectetur adipiscing. Nullam dui
          tortor, mollis vitae molestie sed. Phasellus tincidunt suscipit varius.
        </Container>
        <Table<Instance>
          {...collectionProps}
          header={
            <Header headingTagOverride="h1" counter={`(${allItems.length})`}>
              Instances
            </Header>
          }
          ariaLabels={ariaLabels}
          selectionType="multi"
          onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems)}
          selectedItems={selectedItems}
          stripedRows={preferences.stripedRows}
          contentDensity={preferences.contentDensity}
          wrapLines={preferences.wrapLines}
          columnDefinitions={columnsConfig}
          items={items}
          pagination={<Pagination {...paginationProps} ariaLabels={paginationLabels} />}
          filter={
            <TextFilter
              {...filterProps!}
              countText={getMatchesCountText(filteredItemsCount!)}
              filteringAriaLabel="Filter instances"
            />
          }
          visibleColumns={preferences.visibleContent}
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              onConfirm={({ detail }) => setPreferences(detail)}
              preferences={preferences}
              pageSizePreference={{
                title: 'Select page size',
                options: pageSizeOptions,
              }}
              visibleContentPreference={{
                title: 'Select visible columns',
                options: visibleContentOptions,
              }}
              wrapLinesPreference={{
                label: 'Wrap lines',
                description: 'Wrap lines description',
              }}
              stripedRowsPreference={{
                label: 'Striped rows',
                description: 'Striped rows description',
              }}
              contentDensityPreference={{
                label: 'Compact mode',
                description: 'Display content in a more compact, denser mode',
              }}
            />
          }
        />
      </SpaceBetween>
    </ScreenshotArea>
  );
}

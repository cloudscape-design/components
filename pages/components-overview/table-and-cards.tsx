// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Badge from '~components/badge';
import Cards from '~components/cards';
import CollectionPreferences from '~components/collection-preferences';
import Header from '~components/header';
import KeyValuePairs from '~components/key-value-pairs';
import Link from '~components/link';
import Pagination from '~components/pagination';
import SpaceBetween from '~components/space-between';
import Table from '~components/table';
import TextFilter from '~components/text-filter';

import { cardItems, RandomData, tableItems } from './component-data';
import { Section } from './utils';

export default function TableAndCards() {
  const [selectedItems, setSelectedItems] = useState({
    table: [tableItems[2]],
    cards: [cardItems[1]],
  });
  const [filteringText, setFilteringText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [preferences, setPreferences] = useState({
    pageSize: 5,
    visibleContent: ['name', 'category', 'description'],
  });

  return (
    <SpaceBetween size="xxs">
      <Section header="Cards" container={false}>
        <Cards
          items={cardItems}
          cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }]}
          cardDefinition={{
            header: (item: RandomData) => (
              <Link href="#" fontSize="heading-m">
                {item.name}
              </Link>
            ),
            sections: [
              {
                id: 'key-value-pairs',
                content: item => (
                  <KeyValuePairs
                    columns={2}
                    items={[
                      { label: 'Description', value: item.description },
                      { label: 'Cost', value: item.amount },
                    ]}
                  />
                ),
              },
            ],
          }}
          selectionType="multi"
          selectedItems={selectedItems.cards}
          onSelectionChange={({ detail }) => setSelectedItems(prev => ({ ...prev, cards: detail.selectedItems }))}
          ariaLabels={{
            itemSelectionLabel: (e, item) => `Select ${item.name}`,
            selectionGroupLabel: 'Item selection',
          }}
        />
      </Section>
      <Section header="Table" container={false}>
        <Table
          items={tableItems}
          header={
            <Header
              description="Description"
              counter={`(${tableItems.length})`}
              info={
                <Link variant="info" href="#">
                  Info
                </Link>
              }
            >
              Table with common features
            </Header>
          }
          filter={
            <TextFilter
              filteringText={filteringText}
              filteringPlaceholder="Find resources"
              filteringAriaLabel="Filter resources"
              onChange={({ detail }) => setFilteringText(detail.filteringText)}
            />
          }
          pagination={
            <Pagination
              currentPageIndex={currentPage}
              pagesCount={2}
              onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
              ariaLabels={{
                nextPageLabel: 'Next page',
                previousPageLabel: 'Previous page',
                pageLabel: pageNumber => `Page ${pageNumber}`,
              }}
            />
          }
          preferences={
            <CollectionPreferences
              title="Preferences"
              confirmLabel="Confirm"
              cancelLabel="Cancel"
              preferences={preferences}
              onConfirm={({ detail }) =>
                setPreferences({
                  pageSize: detail.pageSize ?? 5,
                  visibleContent: (detail.visibleContent as string[]) ?? [],
                })
              }
              pageSizePreference={{
                title: 'Page size',
                options: [
                  { value: 5, label: '5 resources' },
                  { value: 10, label: '10 resources' },
                ],
              }}
              visibleContentPreference={{
                title: 'Select visible content',
                options: [
                  {
                    label: 'Main properties',
                    options: [
                      { id: 'name', label: 'Name' },
                      { id: 'category', label: 'Category' },
                      { id: 'description', label: 'Description' },
                    ],
                  },
                ],
              }}
            />
          }
          resizableColumns={true}
          columnDefinitions={[
            {
              id: 'name',
              header: 'Name',
              cell: (item: RandomData) => (
                <Link variant="primary" href="#">
                  {item.name}
                </Link>
              ),
              sortingField: 'name',
              width: 200,
              minWidth: 150,
            },
            {
              id: 'category',
              header: 'Category',
              cell: (item: RandomData) => {
                const categories = ['green', 'grey', 'blue'] as const;
                const labels = ['Serverless', 'Security', 'Agentic AI'];
                const index = item.name.length % 3;
                return <Badge color={categories[index]}>{labels[index]}</Badge>;
              },
              sortingField: 'category',
              width: 150,
              minWidth: 100,
            },
            {
              id: 'description',
              header: 'Description',
              cell: (item: RandomData) => item.description,
              width: 300,
              minWidth: 200,
            },
          ]}
          selectionType="single"
          selectedItems={selectedItems.table}
          onSelectionChange={({ detail }) => setSelectedItems(prev => ({ ...prev, table: detail.selectedItems }))}
          ariaLabels={{
            itemSelectionLabel: (e, item) => `Select ${item.name}`,
            allItemsSelectionLabel: () => 'Select all items',
            selectionGroupLabel: 'Item selection',
          }}
        />
      </Section>
    </SpaceBetween>
  );
}

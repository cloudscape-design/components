// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Badge from '@cloudscape-design/components/badge';
import Cards from '@cloudscape-design/components/cards';
import CollectionPreferences from '@cloudscape-design/components/collection-preferences';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import Pagination from '@cloudscape-design/components/pagination';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Table from '@cloudscape-design/components/table';
import TextFilter from '@cloudscape-design/components/text-filter';

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
    // Cards already have built-in margin so the space between is smaller than oter sections
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
                id: 'description',
                header: 'Description',
                content: item => item.description,
                width: 85,
              },
              {
                id: 'cost',
                header: 'Cost',
                content: item => item.amount,
                width: 15,
              },
            ],
          }}
          selectionType="multi"
          selectedItems={selectedItems.cards}
          onSelectionChange={({ detail }) =>
            setSelectedItems(prevState => ({ ...prevState, cards: detail.selectedItems }))
          }
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
                <Link variant="info" className="secondary-link" href="#">
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
                  { value: 20, label: '20 resources' },
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
          onSelectionChange={({ detail }) =>
            setSelectedItems(prevState => ({ ...prevState, table: detail.selectedItems }))
          }
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

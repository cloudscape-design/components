// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { CollectionPreferences } from '~components';
import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import Pagination from '~components/pagination';
import Table from '~components/table';

import { generateItems, Instance } from './generate-data';

const allItems = generateItems(100);
const PAGE_SIZE = 10;

function JumpToPageClosedContent() {
  const [currentPageIndex, setCurrentPageIndex] = useState(1);

  const totalPages = Math.ceil(allItems.length / PAGE_SIZE);
  const startIndex = (currentPageIndex - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentItems = allItems.slice(startIndex, endIndex);

  return (
    <Table
      header={<h1>Jump to Page - Closed Pagination (100 items, 10 pages)</h1>}
      columnDefinitions={[
        { header: 'ID', cell: (item: Instance) => item.id },
        { header: 'State', cell: (item: Instance) => item.state },
        { header: 'Type', cell: (item: Instance) => item.type },
        { header: 'DNS Name', cell: (item: Instance) => item.dnsName || '-' },
      ]}
      preferences={
        <CollectionPreferences
          title="Preferences"
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          preferences={{
            pageSize: 10,
            contentDisplay: [
              { id: 'variable', visible: true },
              { id: 'value', visible: true },
              { id: 'type', visible: true },
              { id: 'description', visible: true },
            ],
          }}
          pageSizePreference={{
            title: 'Page size',
            options: [
              { value: 10, label: '10 resources' },
              { value: 20, label: '20 resources' },
            ],
          }}
          wrapLinesPreference={{}}
          stripedRowsPreference={{}}
          contentDensityPreference={{}}
          contentDisplayPreference={{
            options: [
              {
                id: 'variable',
                label: 'Variable name',
                alwaysVisible: true,
              },
              { id: 'value', label: 'Text value' },
              { id: 'type', label: 'Type' },
              { id: 'description', label: 'Description' },
            ],
          }}
          stickyColumnsPreference={{
            firstColumns: {
              title: 'Stick first column(s)',
              description: 'Keep the first column(s) visible while horizontally scrolling the table content.',
              options: [
                { label: 'None', value: 0 },
                { label: 'First column', value: 1 },
                { label: 'First two columns', value: 2 },
              ],
            },
            lastColumns: {
              title: 'Stick last column',
              description: 'Keep the last column visible while horizontally scrolling the table content.',
              options: [
                { label: 'None', value: 0 },
                { label: 'Last column', value: 1 },
              ],
            },
          }}
        />
      }
      items={currentItems}
      pagination={
        <Pagination
          currentPageIndex={currentPageIndex}
          pagesCount={totalPages}
          onChange={({ detail }) => setCurrentPageIndex(detail.currentPageIndex)}
          jumpToPage={{}}
        />
      }
    />
  );
}

export default function JumpToPageClosedExample() {
  return (
    <I18nProvider messages={[messages]} locale="en">
      <JumpToPageClosedContent />
    </I18nProvider>
  );
}

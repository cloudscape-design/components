// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import Pagination, { PaginationProps } from '~components/pagination';

import ScreenshotArea from '../utils/screenshot-area';

const paginationLabels: PaginationProps.Labels = {
  paginationLabel: 'Pagination',
  nextPageLabel: 'Next page',
  previousPageLabel: 'Previous page',
  pageLabel: pageNumber => `Page ${pageNumber} of all pages`,
};

export default function PaginationCompactStatesPage() {
  const [compactPageIndex, setCompactPageIndex] = useState(3);
  const [compactDisabledPageIndex, setCompactDisabledPageIndex] = useState(3);
  const [openEndPageIndex, setOpenEndPageIndex] = useState(3);
  const [openEndDisabledPageIndex, setOpenEndDisabledPageIndex] = useState(3);

  return (
    <I18nProvider messages={[messages]} locale="en">
      <ScreenshotArea>
        <h1>Pagination compact states</h1>

        <h2>Compact active</h2>
        <Pagination
          pagesVariant="compact"
          currentPageIndex={compactPageIndex}
          pagesCount={20}
          ariaLabels={paginationLabels}
          onChange={event => setCompactPageIndex(event.detail.currentPageIndex)}
        />

        <h2>Compact disabled</h2>
        <Pagination
          pagesVariant="compact"
          currentPageIndex={compactDisabledPageIndex}
          pagesCount={20}
          disabled={true}
          ariaLabels={paginationLabels}
          onChange={event => setCompactDisabledPageIndex(event.detail.currentPageIndex)}
        />

        <h2>Compact open-ended active</h2>
        <Pagination
          pagesVariant="compact"
          currentPageIndex={openEndPageIndex}
          pagesCount={20}
          openEnd={true}
          ariaLabels={paginationLabels}
          onChange={event => setOpenEndPageIndex(event.detail.currentPageIndex)}
        />

        <h2>Compact open-ended disabled</h2>
        <Pagination
          pagesVariant="compact"
          currentPageIndex={openEndDisabledPageIndex}
          pagesCount={20}
          openEnd={true}
          disabled={true}
          ariaLabels={paginationLabels}
          onChange={event => setOpenEndDisabledPageIndex(event.detail.currentPageIndex)}
        />
      </ScreenshotArea>
    </I18nProvider>
  );
}

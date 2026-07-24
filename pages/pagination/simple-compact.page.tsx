// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import Pagination, { PaginationProps } from '~components/pagination';

import ScreenshotArea from '../utils/screenshot-area';

const paginationLabelsWithout: PaginationProps.Labels = {
  nextPageLabel: 'Next page',
  previousPageLabel: 'Previous page',
  pageLabel: pageNumber => `Page ${pageNumber} of all pages`,
  jumpToPageButton: 'Go to page',
};

const paginationLabels: PaginationProps.Labels = {
  paginationLabel: 'Pagination',
  ...paginationLabelsWithout,
};

export default function PaginationSimplePage() {
  const [compactPageIndex, setCompactPageIndex] = useState(1);
  const [compactJumpPageIndex, setCompactJumpPageIndex] = useState(1);

  return (
    <I18nProvider messages={[messages]} locale="en">
      <ScreenshotArea>
        <h1>Pagination simple compact</h1>
        <h2>Compact pagination with 20 pages (default &quot;# of #&quot; format)</h2>
        <Pagination
          pagesVariant="compact"
          currentPageIndex={compactPageIndex}
          pagesCount={20}
          ariaLabels={paginationLabels}
          onChange={event => setCompactPageIndex(event.detail.currentPageIndex)}
        />

        <h2>Compact pagination with 20 pages without the paginationLabel</h2>
        <Pagination
          pagesVariant="compact"
          currentPageIndex={compactJumpPageIndex}
          pagesCount={20}
          ariaLabels={paginationLabelsWithout}
          onChange={event => setCompactJumpPageIndex(event.detail.currentPageIndex)}
        />
      </ScreenshotArea>
    </I18nProvider>
  );
}

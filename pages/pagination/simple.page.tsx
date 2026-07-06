// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import Pagination, { PaginationProps } from '~components/pagination';

import ScreenshotArea from '../utils/screenshot-area';

const paginationLabels: PaginationProps.Labels = {
  nextPageLabel: 'Next page',
  previousPageLabel: 'Previous page',
  pageLabel: pageNumber => `Page ${pageNumber} of all pages`,
  jumpToPageButton: 'Go to page',
};

const i18nStrings: PaginationProps.I18nStrings = {
  jumpToPageInputLabel: 'Page number',
  jumpToPageError: 'Enter a valid page number',
  jumpToPageLoadingText: 'Loading page',
  compactPageCounterText: (currentPageIndex, pagesCount) => `${currentPageIndex} / ${pagesCount}`,
};

export default function PaginationSimplePage() {
  const [basicPageIndex, setBasicPageIndex] = useState(1);
  const [jumpPageIndex, setJumpPageIndex] = useState(1);
  const [compactPageIndex, setCompactPageIndex] = useState(1);
  const [compactJumpPageIndex, setCompactJumpPageIndex] = useState(1);

  return (
    <I18nProvider messages={[messages]} locale="en">
      <h1>Pagination simple</h1>
      <ScreenshotArea>
        <h2>Basic pagination with 20 pages</h2>
        <Pagination
          currentPageIndex={basicPageIndex}
          pagesCount={20}
          ariaLabels={paginationLabels}
          onChange={event => setBasicPageIndex(event.detail.currentPageIndex)}
        />

        <h2>Basic pagination with jump to page</h2>
        <Pagination
          currentPageIndex={jumpPageIndex}
          pagesCount={20}
          ariaLabels={paginationLabels}
          i18nStrings={i18nStrings}
          jumpToPage={{}}
          onChange={event => setJumpPageIndex(event.detail.currentPageIndex)}
        />

        <h2>Compact pagination with 20 pages (default &quot;# of #&quot; format)</h2>
        <Pagination
          variant="compact"
          currentPageIndex={compactPageIndex}
          pagesCount={20}
          ariaLabels={paginationLabels}
          onChange={event => setCompactPageIndex(event.detail.currentPageIndex)}
        />

        <h2>Compact pagination with jump to page (custom &quot;# / #&quot; format)</h2>
        <Pagination
          variant="compact"
          currentPageIndex={compactJumpPageIndex}
          pagesCount={20}
          ariaLabels={paginationLabels}
          i18nStrings={i18nStrings}
          jumpToPage={{}}
          onChange={event => setCompactJumpPageIndex(event.detail.currentPageIndex)}
        />
      </ScreenshotArea>
    </I18nProvider>
  );
}

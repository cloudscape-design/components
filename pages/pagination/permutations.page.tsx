// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import I18nProvider from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import Pagination, { PaginationProps } from '~components/pagination';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
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
  pagesCompactText: ({ currentPage, pagesCount, openEnd }) => `${currentPage} / ${pagesCount}${openEnd ? '+' : ''}`,
};

const permutations = createPermutations<PaginationProps>([
  {
    currentPageIndex: [7],
    pagesCount: [15],
    disabled: [true],
    ariaLabels: [paginationLabels],
    jumpToPage: [undefined, { loading: false }],
  },
  {
    currentPageIndex: [1, 6, 15],
    pagesCount: [15],
    openEnd: [true, false],
    ariaLabels: [paginationLabels],
    jumpToPage: [undefined, { loading: false }, { loading: true }],
  },
  {
    pagesVariant: ['compact'],
    currentPageIndex: [1, 6, 15],
    openEnd: [true, false],
    pagesCount: [15],
    disabled: [true, false],
    ariaLabels: [paginationLabels],
    i18nStrings: [undefined, i18nStrings],
    jumpToPage: [undefined, { loading: false }],
  },
]);

export default function PaginationPermutations() {
  return (
    <I18nProvider messages={[messages]} locale="en">
      <h1>Pagination permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={permutation => <Pagination {...permutation} />} />
      </ScreenshotArea>
    </I18nProvider>
  );
}

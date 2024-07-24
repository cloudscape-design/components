// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Pagination, { PaginationProps } from '~components/pagination';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const paginationLabels: PaginationProps.Labels = {
  nextPageLabel: 'Next page',
  previousPageLabel: 'Previous page',
  pageLabel: pageNumber => `Page ${pageNumber} of all pages`,
};

const permutations = createPermutations<PaginationProps>([
  {
    currentPageIndex: [7],
    pagesCount: [15],
    disabled: [true],
    ariaLabels: [paginationLabels],
  },
  {
    currentPageIndex: [1, 6, 15],
    pagesCount: [15],
    openEnd: [true, false],
    ariaLabels: [paginationLabels],
  },
]);

export default function PaginationPermutations() {
  return (
    <>
      <h1>Pagination permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <Pagination {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}

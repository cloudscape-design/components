// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject } from 'react';

import { useStickyHeaderSync } from '../internal/components/sticky-header/use-sticky-header-sync';

export const useStickyHeader = (
  tableRef: RefObject<HTMLElement>,
  theadRef: RefObject<HTMLElement>,
  secondaryTheadRef: RefObject<HTMLElement>,
  secondaryTableRef: RefObject<HTMLElement>,
  tableWrapperRef: RefObject<HTMLElement>
) =>
  useStickyHeaderSync({
    realTableRef: tableRef,
    realHeaderRef: theadRef,
    copyHeaderRef: secondaryTheadRef,
    copyTableRef: secondaryTableRef,
    tuckTargetRef: tableWrapperRef,
  });

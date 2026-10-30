// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, RefObject } from 'react';

import { useStickyPosition } from '../internal/components/sticky-header/use-sticky-position';

interface StickyHeaderContextProps {
  isStuck: boolean;
  isStuckAtBottom: boolean;
}

export const StickyHeaderContext = createContext<StickyHeaderContextProps>({
  isStuck: false,
  isStuckAtBottom: false,
});

export const useStickyHeader = (
  rootRef: RefObject<HTMLDivElement>,
  headerRef: RefObject<HTMLDivElement>,
  __stickyHeader?: boolean,
  __stickyOffset?: number,
  __mobileStickyOffset?: number,
  __disableMobile?: boolean,
  __additionalOffset = false
) =>
  useStickyPosition(rootRef, headerRef, {
    sticky: __stickyHeader,
    offset: __stickyOffset,
    mobileOffset: __mobileStickyOffset,
    disableMobile: __disableMobile,
    additionalOffset: __additionalOffset,
  });

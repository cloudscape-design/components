// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { RefObject, useCallback, useEffect, useState } from 'react';

// Minimum scrollable space is the space other than the sticky content, for instance for a sticky footer it's the
// the space other than htat, which would be drawer height minus footer height.
export const MINIMUM_SCROLLABLE_SPACE = 148;

export function useStickyFooter({
  drawerRef,
  footerRef,
}: {
  drawerRef: RefObject<HTMLElement>;
  footerRef: RefObject<HTMLElement>;
}) {
  const [isSticky, setIsSticky] = useState(true);

  const checkStickyState = useCallback(() => {
    if (!drawerRef.current || !footerRef.current) {
      return;
    }

    const parentElement = drawerRef.current.parentElement;
    const parentElementHeight = parentElement?.getBoundingClientRect().height;
    const drawerHeight = drawerRef.current.getBoundingClientRect().height;
    const effectiveHeight = Math.min(parentElementHeight ?? drawerHeight, drawerHeight);

    // take minimum of drawer and parent height
    const footerHeight = footerRef.current.getBoundingClientRect().height;

    const scrollableHeight = effectiveHeight - footerHeight;
    const hasEnoughSpace = scrollableHeight >= MINIMUM_SCROLLABLE_SPACE;

    setIsSticky(hasEnoughSpace);
  }, [footerRef, drawerRef]);

  useEffect(() => {
    // for server rendering
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('resize', checkStickyState);
    checkStickyState();

    return () => window.removeEventListener('resize', checkStickyState);
  }, [checkStickyState]);

  return { isSticky };
}

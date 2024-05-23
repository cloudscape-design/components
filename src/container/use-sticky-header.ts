// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useState, useLayoutEffect, useCallback, useEffect, createContext } from 'react';
import { findUpUntil } from '../internal/utils/dom';
import { getOverflowParents } from '../internal/utils/scrollable-containers';
import { useMobile } from '../internal/hooks/use-mobile';
import globalVars from '../internal/styles/global-vars';

interface StickyHeaderContextProps {
  isStuck: boolean;
}

interface ComputeOffsetProps {
  isMobile: boolean;
  __stickyOffset?: number;
  __mobileStickyOffset?: number;
  hasInnerOverflowParents: boolean;
}

export function computeOffset({
  isMobile,
  __stickyOffset,
  __mobileStickyOffset,
  hasInnerOverflowParents,
}: ComputeOffsetProps): string {
  const localOffset = isMobile ? (__stickyOffset ?? 0) - (__mobileStickyOffset ?? 0) : __stickyOffset ?? 0;
  if (hasInnerOverflowParents || __stickyOffset !== undefined) {
    return `${localOffset}px`;
  }
  const globalOffset = `var(${globalVars.stickyVerticalTopOffset}, 0px)`;

  return `calc(${globalOffset} + ${localOffset}px)`;
}

export const StickyHeaderContext = createContext<StickyHeaderContextProps>({
  isStuck: false,
});

export const useStickyHeader = (
  rootRef: RefObject<HTMLDivElement>,
  headerRef: RefObject<HTMLDivElement>,
  __stickyHeader?: boolean,
  __stickyOffset?: number,
  __mobileStickyOffset?: number,
  __disableMobile = true
) => {
  const isMobile = useMobile();
  const disableSticky = isMobile && __disableMobile;
  const isSticky = !disableSticky && !!__stickyHeader;

  // If it has overflow parents inside the app layout, we shouldn't apply a sticky offset.
  const [hasInnerOverflowParents, setHasInnerOverflowParents] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  useLayoutEffect(() => {
    if (rootRef.current) {
      const overflowParents = getOverflowParents(rootRef.current);
      const mainElement = findUpUntil(rootRef.current, elem => elem.tagName === 'MAIN');
      // In both versions of the app layout, the scrolling element for disableBodyScroll
      // is the <main>. If the closest overflow parent is also the closest <main> and we have
      // offset values, it's safe to assume that it's the app layout scroll root and we
      // should stop there.
      setHasInnerOverflowParents(overflowParents.length > 0 && overflowParents[0] !== mainElement);
    }
  }, [rootRef]);

  const computedOffset = computeOffset({
    isMobile,
    __stickyOffset,
    __mobileStickyOffset,
    hasInnerOverflowParents,
  });

  const stickyStyles = isSticky
    ? {
        style: {
          top: computedOffset,
        },
      }
    : {};

  // "stuck" state, when the header has moved from its original posititon has a
  // box-shadow, applied here by a "header-stuck" className
  const checkIfStuck = useCallback(() => {
    if (rootRef.current && headerRef.current) {
      const rootTopBorderWidth = parseFloat(getComputedStyle(rootRef.current).borderTopWidth) || 0;
      const rootTop = rootRef.current.getBoundingClientRect().top + rootTopBorderWidth;
      const headerTop = headerRef.current.getBoundingClientRect().top;

      if (rootTop < headerTop) {
        setIsStuck(true);
      } else {
        setIsStuck(false);
      }
    }
  }, [rootRef, headerRef]);
  useEffect(() => {
    if (isSticky) {
      window.addEventListener('scroll', checkIfStuck, true);
      window.addEventListener('resize', checkIfStuck);
      return () => {
        window.removeEventListener('scroll', checkIfStuck, true);
        window.removeEventListener('resize', checkIfStuck);
      };
    }
  }, [isSticky, checkIfStuck]);
  return {
    isSticky,
    isStuck,
    stickyStyles,
  };
};

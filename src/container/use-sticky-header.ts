// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, RefObject, useCallback, useEffect, useLayoutEffect, useState } from 'react';

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';

import * as tokens from '../internal/generated/styles/tokens';
import { useMobile } from '../internal/hooks/use-mobile';
import globalVars from '../internal/styles/global-vars';
import { getOverflowParents } from '../internal/utils/scrollable-containers';
import { ContainerProps } from './interfaces';

interface StickyHeaderContextProps {
  isStuck: boolean;
}

interface ComputeOffsetProps {
  isMobile: boolean;
  __stickyOffset?: number;
  __mobileStickyOffset?: number;
  hasInnerOverflowParents: boolean;
  __additionalOffset?: boolean;
}

export function computeOffset({
  isMobile,
  __stickyOffset,
  __mobileStickyOffset,
  hasInnerOverflowParents,
  __additionalOffset,
}: ComputeOffsetProps): string {
  const localOffset = isMobile ? (__stickyOffset ?? 0) - (__mobileStickyOffset ?? 0) : __stickyOffset ?? 0;
  if (hasInnerOverflowParents || __stickyOffset !== undefined) {
    return `${localOffset}px`;
  }
  const globalOffset = `var(${globalVars.stickyVerticalTopOffset}, 0px)`;

  return `calc(${globalOffset} + ${localOffset}px + ${__additionalOffset ? tokens.spaceScaledS : '0px'})`;
}

export const StickyHeaderContext = createContext<StickyHeaderContextProps>({
  isStuck: false,
});

export const useStickyHeader = (
  rootRef: RefObject<HTMLDivElement>,
  headerRef: RefObject<HTMLDivElement>,
  variant: ContainerProps['variant'] | 'embedded' | 'full-page' | 'cards' = 'default',
  __stickyHeader?: boolean,
  __stickyOffset?: number,
  __mobileStickyOffset?: number,
  __disableMobile?: boolean,
  __additionalOffset = false
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
    __additionalOffset,
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
  const checkIfStuck = useCallback(
    ({ isTrusted, target, type }) => {
      if (type === 'resize' && target === window && !isTrusted) {
        // The window size didn't actually change, it was a synthetic event
        return;
      }
      if (rootRef.current && headerRef.current) {
        // const overflowParents = getOverflowParents(rootRef.current);
        // const mainElement = findUpUntil(rootRef.current, elem => elem.tagName === 'MAIN');
        const rootTopBorderWidth = parseFloat(getComputedStyle(rootRef.current).borderTopWidth) || 0;
        //using math.Round to adjust for rounding errors in floating-point arithmetic and timing issues
        const rootTop = Math.round((rootRef.current.getBoundingClientRect().top + rootTopBorderWidth) * 10000) / 10000;
        const headerTop = Math.round(headerRef.current.getBoundingClientRect().top * 10000) / 10000;

        // console.log({ headerTopDistance, currentHTD: rootTop - headerTop, overflowParents, mainElement, rootTopBorderWidth, rootTop, headerTop, variant, isStuck: (variant === 'full-page' || headerTop === 0 || hasInnerOverflowParents) && rootTop < headerTop})
        if (
          (variant === 'full-page' ||
            headerTop === 0 || //when the header is at the top of the page
            headerTop !== rootTop) &&
          rootTop < headerTop
        ) {
          setIsStuck(true);
        } else {
          setIsStuck(false);
        }
      }
    },
    [rootRef, headerRef, variant]
  );
  useEffect(() => {
    if (isSticky) {
      const controller = new AbortController();
      window.addEventListener('scroll', checkIfStuck, { capture: true, signal: controller.signal });
      window.addEventListener('resize', checkIfStuck, { signal: controller.signal });
      return () => {
        controller.abort();
      };
    }
  }, [isSticky, checkIfStuck]);
  return {
    isSticky,
    isStuck,
    stickyStyles,
  };
};

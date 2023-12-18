// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useState, useLayoutEffect, useCallback, useEffect, createContext } from 'react';
import { useAppLayoutContext } from '../internal/context/app-layout-context';
import { findUpUntil, supportsStickyPosition } from '../internal/utils/dom';
import { getOverflowParents } from '../internal/utils/scrollable-containers';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import customCssProps from '../internal/generated/custom-css-properties';
import { useMobile } from '../internal/hooks/use-mobile';
interface StickyHeaderContextProps {
  isStuck: boolean;
}

interface ComputeOffsetProps {
  isMobile: boolean;
  isVisualRefresh: boolean;
  customCssProps: Record<string, string>;
  __stickyOffset?: number;
  __mobileStickyOffset?: number;
  mobileBarHeight?: number;
  stickyOffsetTop: number;
  hasInnerOverflowParents: boolean;
}

export function computeOffset({
  isMobile,
  isVisualRefresh,
  customCssProps,
  __stickyOffset,
  __mobileStickyOffset,
  mobileBarHeight = 0,
  stickyOffsetTop,
  hasInnerOverflowParents,
}: ComputeOffsetProps) {
  const effectiveStickyOffset = __stickyOffset ?? (hasInnerOverflowParents ? 0 : stickyOffsetTop);
  /**
   * The AppLayout refactor removed the need for passing the sticky offset in px all the time through the
   * AppLayoutDomContext provider because that information already exists on the DOM in a custom property
   * on the Layout subcomponent. Thus, if the Container header is sticky, we are in Visual Refresh and use
   * body scroll then we will use that property. When a component is used outside AppLayout, we fall back
   * to the default offset calculated in AppLayoutDomContext.
   */
  let computedOffset = `${effectiveStickyOffset}px`;
  if (isMobile) {
    // This mobile offset is only relevant for full page tables in the mobile viewport.
    // It is obtained by the sum of stickyOffsetTop (AppLayout header height), mobileBarHeight (AppLayout mobile bar height) and
    // __stickyOffset (value of the stickyHeaderVerticalOffset, set by users), from which we subtract __mobileStickyOffset (which is the table tools header height).

    // Classic offset is calculated using the AppLayout context
    const classicOffset = `${
      stickyOffsetTop + mobileBarHeight + (__stickyOffset ?? 0) - (__mobileStickyOffset ?? 0)
    }px`;

    // VR offset is calculated using CSS custom properties
    const visualRefreshOffset = `calc(var(${customCssProps.offsetTop}, 0px) + var(${
      customCssProps.mobileBarHeight
    }, 0px) + ${(__stickyOffset ?? 0) - (__mobileStickyOffset ?? 0)}px)`;

    computedOffset = isVisualRefresh ? visualRefreshOffset : classicOffset;
  } else if (isVisualRefresh && !hasInnerOverflowParents) {
    computedOffset = `var(${customCssProps.offsetTopWithNotifications}, ${computedOffset})`;
  }
  return computedOffset;
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
  // We reach into AppLayoutContext in case sticky header needs to be offset down by the height
  // of other sticky elements positioned on top of the view.
  const { stickyOffsetTop, mobileBarHeight } = useAppLayoutContext();
  const disableSticky = isMobile && __disableMobile;
  const isSticky = supportsStickyPosition() && !disableSticky && !!__stickyHeader;
  const isVisualRefresh = useVisualRefresh();

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
    isVisualRefresh,
    customCssProps,
    __stickyOffset,
    __mobileStickyOffset,
    mobileBarHeight,
    stickyOffsetTop,
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

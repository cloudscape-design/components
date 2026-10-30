// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useLayoutEffect, useState } from 'react';

import { findUpUntil } from '@cloudscape-design/component-toolkit/dom';

import * as tokens from '../../generated/styles/tokens';
import { useMobile } from '../../hooks/use-mobile';
import globalVars from '../../styles/global-vars';
import { getOverflowParents } from '../../utils/scrollable-containers';
import { useHeaderStuck } from './use-header-stuck';

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
  const localOffset = isMobile ? (__stickyOffset ?? 0) - (__mobileStickyOffset ?? 0) : (__stickyOffset ?? 0);
  if (hasInnerOverflowParents || __stickyOffset !== undefined) {
    return `${localOffset}px`;
  }
  const globalOffset = `var(${globalVars.stickyVerticalTopOffset}, 0px)`;

  return `calc(${globalOffset} + ${localOffset}px + ${__additionalOffset ? tokens.spaceScaledS : '0px'})`;
}

interface StickyPositionOptions {
  sticky?: boolean;
  offset?: number;
  mobileOffset?: number;
  disableMobile?: boolean;
  additionalOffset?: boolean;
}

export function useStickyPosition(
  rootRef: RefObject<HTMLElement>,
  headerRef: RefObject<HTMLElement>,
  { sticky, offset, mobileOffset, disableMobile, additionalOffset = false }: StickyPositionOptions
) {
  const isMobile = useMobile();
  const disableSticky = isMobile && disableMobile;
  const isSticky = !disableSticky && !!sticky;

  // If it has overflow parents inside the app layout, we shouldn't apply a sticky offset.
  const [hasInnerOverflowParents, setHasInnerOverflowParents] = useState(false);

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
    __stickyOffset: offset,
    __mobileStickyOffset: mobileOffset,
    hasInnerOverflowParents,
    __additionalOffset: additionalOffset,
  });

  const stickyStyles = isSticky
    ? {
        style: {
          top: computedOffset,
        },
      }
    : {};

  const { isStuck, isStuckAtBottom } = useHeaderStuck(rootRef, headerRef, isSticky);

  return {
    isSticky,
    isStuck,
    isStuckAtBottom,
    stickyStyles,
  };
}

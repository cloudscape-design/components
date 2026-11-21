// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useLayoutEffect, useRef } from 'react';

import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { VirtualTableProps } from './interfaces';

// Built-in live tail (F2 headline feature). `follow` is controlled — the console owns the
// policy (and typically renders its own "jump to newest" control), VirtualTable owns the
// pin-to-newest mechanics and the release-on-scroll-away detection:
//  - while following, an append pins the viewport to the newest row in a layout effect,
//    AFTER the runway grows, so the pin is exact and independent of any at-bottom
//    tolerance (the coupling the F1 demos had to work around consumer-side);
//  - when the user scrolls away from the bottom, it fires onFollowChange(false,
//    'scroll-away') once so the console can release follow.
// Scroll is an instant scrollTop assignment (never smooth), so it is reduced-motion-safe
// by construction; the prefers-reduced-motion query is read only to keep that guarantee
// explicit for any future animated affordance.
interface UseLiveTailParams {
  follow: boolean;
  itemCount: number;
  scrollContainerRef: React.RefObject<HTMLElement>;
  scrollToEnd: () => void;
  isPinnedToEnd: () => boolean;
  onFollowChange?: NonCancelableEventHandler<VirtualTableProps.FollowChangeDetail>;
}

export function useLiveTail({
  follow,
  itemCount,
  scrollContainerRef,
  scrollToEnd,
  isPinnedToEnd,
  onFollowChange,
}: UseLiveTailParams): void {
  // Pin to newest on entering follow and on every append while following. Runs in a
  // layout effect so the runway has already grown to the new total height.
  useLayoutEffect(() => {
    if (follow) {
      scrollToEnd();
    }
  }, [follow, itemCount, scrollToEnd]);

  // Release follow when the user scrolls away from the bottom. Fired at most once per
  // follow session (a ref guards against re-firing before the controlled prop updates);
  // our own pin lands at the bottom (isPinnedToEnd() true) so auto-scroll never triggers it.
  const releasedRef = useRef(false);
  useEffect(() => {
    releasedRef.current = false;
  }, [follow]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || !follow) {
      return;
    }
    const onScroll = () => {
      if (!releasedRef.current && !isPinnedToEnd()) {
        releasedRef.current = true;
        fireNonCancelableEvent(onFollowChange, { follow: false, reason: 'scroll-away' });
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [follow, scrollContainerRef, isPinnedToEnd, onFollowChange]);
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { RefObject, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';

import { useHeaderStuck } from '../internal/components/sticky-header/use-header-stuck';
import { useStickyHeaderSync } from '../internal/components/sticky-header/use-sticky-header-sync';

import styles from './styles.css.js';

interface StickyHeaderSlotProps {
  rootRef: RefObject<HTMLElement>;
  // Populated by the parent's real <table> callback ref; used to measure/tuck the real header.
  realTableRef: RefObject<HTMLElement>;
  realHeaderRef: RefObject<HTMLElement>;
  // The body scroller: tucked up under the copy, and the element whose scroll-padding clears the copy.
  tuckTargetRef: RefObject<HTMLElement>;
  // Owned by the parent so it can also drive the body scroller's horizontal-scroll mirror.
  copyScrollerRef: RefObject<HTMLDivElement>;
  onScroll: (event: React.UIEvent) => void;
  offset: number;
  headChild: React.ReactNode;
}

// The shadow copy of the header. Rendered only while stickyHeader is on, so the whole apparatus (its
// ResizeObserver-backed tuck, window stuck-listeners, and inert copy) is absent for the default case.
export default function StickyHeaderSlot({
  rootRef,
  realTableRef,
  realHeaderRef,
  tuckTargetRef,
  copyScrollerRef,
  onScroll,
  offset,
  headChild,
}: StickyHeaderSlotProps) {
  const slotRef = useRef<HTMLDivElement>(null);
  const copyTableRef = useRef<HTMLElement | null>(null);
  const copyHeaderRef = useRef<HTMLElement | null>(null);

  // The copy <thead> belongs to a child component we can't ref directly, so derive it from the copy
  // <table> in a callback ref — this runs at commit, before the sync hook's layout effect.
  const setCopyTable = useCallback((node: HTMLTableElement | null) => {
    copyTableRef.current = node;
    copyHeaderRef.current = node ? node.querySelector('thead') : null;
  }, []);

  // Tucks the real header up under the opaque copy by the header's height (shared shadow-copy core).
  useStickyHeaderSync({ realTableRef, realHeaderRef, copyHeaderRef, copyTableRef, tuckTargetRef });
  const { isStuck } = useHeaderStuck(rootRef, slotRef, true);

  // The copy is decorative: aria-hidden alone leaves its duplicated controls tabbable, so mark the slot
  // inert (imperatively — React 16 doesn't forward the inert attribute) to keep a single tab stop.
  useEffect(() => {
    if (slotRef.current) {
      slotRef.current.inert = true;
    }
  });

  // Publish the header height so the owned scroller's scroll-padding clears the pinned copy. The
  // page-scroll case is consumer guidance (they pad their own scroll root); this covers a bounded scroller.
  useLayoutEffect(() => {
    if (copyHeaderRef.current && tuckTargetRef.current) {
      tuckTargetRef.current.style.setProperty(
        '--sticky-header-height',
        `${copyHeaderRef.current.getBoundingClientRect().height}px`
      );
    }
  });

  return (
    <div
      ref={slotRef}
      aria-hidden={true}
      className={clsx(styles['sticky-slot'], isStuck && styles['sticky-slot-stuck'])}
      style={{ insetBlockStart: `${offset}px` }}
    >
      <div className={styles['sticky-copy-scroller']} ref={copyScrollerRef} onScroll={onScroll}>
        <table ref={setCopyTable} role="table" className={clsx(styles.table, styles['table-grid'])}>
          {headChild}
        </table>
      </div>
    </div>
  );
}

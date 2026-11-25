// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useEffect, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import { useIntersectionObserver } from '../../hooks/use-intersection-observer';
import { useVisualRefresh } from '../../hooks/use-visual-mode';
import { browserScrollbarSize } from '../../utils/browser-scrollbar-size';
import { StickyScrollbarContentOptions, useStickyScrollbar } from './use-sticky-scrollbar';

import styles from './styles.css.js';

interface StickyScrollbarProps extends StickyScrollbarContentOptions {
  wrapperRef: React.RefObject<HTMLDivElement>;
  tableRef: React.RefObject<HTMLTableElement>;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  hasStickyColumns?: boolean;
}

export default forwardRef(StickyScrollbar);

function StickyScrollbar(
  { wrapperRef, tableRef, onScroll, hasStickyColumns, getContentInlineSize, contentKey }: StickyScrollbarProps,
  ref: React.Ref<HTMLDivElement>
) {
  const isVisualRefresh = useVisualRefresh();
  const scrollbarRef = React.useRef<HTMLDivElement>(null);
  const scrollbarContentRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(ref, scrollbarRef);

  /**
   * Scrollbar height is 0 if the platform uses overlay (floating) scrollbars (e.g. Mac).
   * Scrollbar size is always 0 during SSR and potentially non-zero on the first render,
   * so for SSR-stability, we need to determine and set this in a client-side effect.
   */
  const [scrollbarOccupiesSpace, setScrollbarOccupiesSpace] = useState(false);
  useEffect(() => {
    setScrollbarOccupiesSpace(browserScrollbarSize().height > 0);
  }, []);
  const offsetScrollbar = hasStickyColumns || !scrollbarOccupiesSpace;

  useStickyScrollbar(scrollbarRef, scrollbarContentRef, tableRef, wrapperRef, offsetScrollbar, {
    getContentInlineSize,
    contentKey,
  });

  const { ref: stickyDetectionRef, isIntersecting: isStickyDetectionVisible } = useIntersectionObserver();

  return (
    <>
      <div
        ref={mergedRef}
        className={clsx(
          styles['sticky-scrollbar'],
          offsetScrollbar && styles['sticky-scrollbar-offset'],
          isVisualRefresh && styles['is-visual-refresh']
        )}
        onScroll={onScroll}
        data-stuck={!isStickyDetectionVisible}
      >
        <div ref={scrollbarContentRef} className={styles['sticky-scrollbar-content']} />
      </div>
      <div ref={stickyDetectionRef} style={{ position: 'absolute', right: 0, bottom: 0, left: 0, height: 1 }} />
    </>
  );
}

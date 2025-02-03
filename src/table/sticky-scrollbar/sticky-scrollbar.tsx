// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import clsx from 'clsx';

import { useIntersectionObserver } from '../../internal/hooks/use-intersection-observer';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import { browserScrollbarSize } from '../../internal/utils/browser-scrollbar-size';
import { useStickyScrollbar } from './use-sticky-scrollbar';

import styles from './styles.css.js';

interface StickyScrollbarProps {
  wrapperRef: React.RefObject<HTMLDivElement>;
  tableRef: React.RefObject<HTMLTableElement>;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
  hasStickyColumns?: boolean;
}

export default forwardRef(StickyScrollbar);

function StickyScrollbar(
  { wrapperRef, tableRef, onScroll, hasStickyColumns }: StickyScrollbarProps,
  ref: React.Ref<HTMLDivElement>
) {
  const scrollbarRef = React.useRef<HTMLDivElement>(null);
  const scrollbarContentRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(ref, scrollbarRef);

  /**
   * If the height of the scrollbar is 0, we're likely on a platform that uses
   * overlay scrollbars (e.g. Mac).
   */
  const offsetScrollbar = hasStickyColumns || browserScrollbarSize().height === 0;

  useStickyScrollbar(scrollbarRef, scrollbarContentRef, tableRef, wrapperRef, offsetScrollbar);

  const { ref: stickyDetectionRef, isIntersecting: isStickyDetectionVisible } = useIntersectionObserver();

  return (
    <>
      <div
        ref={mergedRef}
        className={clsx(
          styles['sticky-scrollbar'],
          offsetScrollbar && styles['sticky-scrollbar-offset'],
          styles['is-visual-refresh']
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

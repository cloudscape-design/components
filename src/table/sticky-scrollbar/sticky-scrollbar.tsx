// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';
import { useStickyScrollbar } from './use-sticky-scrollbar';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import clsx from 'clsx';
import styles from './styles.css.js';
import { browserScrollbarSize } from '../../internal/utils/browser-scrollbar-size';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';

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
  const isVisualRefresh = useVisualRefresh();
  const scrollbarRef = React.useRef<HTMLDivElement>(null);
  const scrollbarContentRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(ref, scrollbarRef);

  /**
   * If the height of the scrollbar is 0, we're likely on a platform that uses
   * overlay scrollbars (e.g. Mac).
   */
  const offsetScrollbar = hasStickyColumns || browserScrollbarSize().height === 0;

  useStickyScrollbar(scrollbarRef, scrollbarContentRef, tableRef, wrapperRef, offsetScrollbar);
  return (
    <div
      ref={mergedRef}
      className={clsx(
        styles['sticky-scrollbar'],
        offsetScrollbar && styles['sticky-scrollbar-offset'],
        isVisualRefresh && styles['is-visual-refresh']
      )}
      onScroll={onScroll}
    >
      <div ref={scrollbarContentRef} className={styles['sticky-scrollbar-content']} />
    </div>
  );
}

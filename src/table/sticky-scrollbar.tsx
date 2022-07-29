// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useContext } from 'react';
import { AppLayoutContext } from '../app-layout/visual-refresh/context';
import { useAppLayoutContext } from '../internal/context/app-layout-context';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useStickyScrollbar } from './use-sticky-scrollbar';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import styles from './styles.css.js';

interface StickyScrollbarProps {
  wrapperRef: React.RefObject<HTMLDivElement>;
  tableRef: React.RefObject<HTMLTableElement>;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
}

export default forwardRef(StickyScrollbar);

function StickyScrollbar({ wrapperRef, tableRef, onScroll }: StickyScrollbarProps, ref: React.Ref<HTMLDivElement>) {
  const scrollbarRef = React.useRef<HTMLDivElement>(null);
  const scrollbarContentRef = React.useRef<HTMLDivElement>(null);
  const isRefresh = useVisualRefresh(scrollbarRef);
  const mergedRef = useMergeRefs(ref, scrollbarRef);

  /**
   * Use the appropriate AppLayout context (Classic or Visual Refresh) to determine
   * the offsetBottom value to be used in the useStickyScrollbar hook.
   */
  const { stickyOffsetBottom: offsetBottomClassic } = useAppLayoutContext();
  const { offsetBottom: offsetBottomVisualRefresh } = useContext(AppLayoutContext);
  const offsetBottom = isRefresh ? offsetBottomVisualRefresh : offsetBottomClassic;

  useStickyScrollbar(scrollbarRef, scrollbarContentRef, tableRef, wrapperRef, offsetBottom);

  return (
    <div ref={mergedRef} className={styles['sticky-scrollbar']} onScroll={onScroll}>
      <div ref={scrollbarContentRef} className={styles['sticky-scrollbar-content']} />
    </div>
  );
}

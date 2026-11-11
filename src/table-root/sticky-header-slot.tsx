// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

interface StickyHeaderSlotProps {
  slotRef: React.Ref<HTMLDivElement>;
  copyScrollerRef: React.Ref<HTMLDivElement>;
  copyTableRef: React.Ref<HTMLTableElement>;
  onScroll: React.UIEventHandler<HTMLDivElement>;
  onFocus: React.FocusEventHandler<HTMLDivElement>;
  isStuck: boolean;
  isGrid: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

// Hidden from assistive technology and the tab order, but clickable: it covers the real header. Focus that
// lands in it is moved to the real header.
export default function StickyHeaderSlot({
  slotRef,
  copyScrollerRef,
  copyTableRef,
  onScroll,
  onFocus,
  isStuck,
  isGrid,
  style,
  children,
}: StickyHeaderSlotProps) {
  return (
    <div
      ref={slotRef}
      aria-hidden={true}
      className={clsx(styles['sticky-slot'], isStuck && styles['sticky-slot-stuck'])}
      style={style}
      onFocus={onFocus}
    >
      <div className={styles['sticky-copy-scroller']} ref={copyScrollerRef} onScroll={onScroll} tabIndex={-1}>
        <table
          ref={copyTableRef}
          role="table"
          className={clsx(styles.table, isGrid ? styles['table-grid'] : styles['table-copy-fixed'])}
        >
          {children}
        </table>
      </div>
    </div>
  );
}

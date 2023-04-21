// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import styles from '../styles.css.js';
import { StickyStateModel, useStickySyles } from '../sticky-state-model';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import { TableProps } from '../interfaces';

interface TableHeaderSelectionCellProps {
  className?: string;
  selectionType: TableProps.SelectionType;
  children: React.ReactNode;
  stickyState: StickyStateModel;
}

export function TableHeaderSelectionCell(props: TableHeaderSelectionCellProps) {
  const { children, selectionType, stickyState, className } = props;
  const ref = React.useRef<HTMLElement>(null) as React.MutableRefObject<HTMLElement | null>;
  const isVisualRefresh = useVisualRefresh();
  const selectionCellClass = clsx(
    styles['selection-control'],
    styles['selection-control-header'],
    isVisualRefresh && styles['is-visual-refresh']
  );
  useStickySyles({ stickyState, ref, colIndex: 0, cellType: 'th' });
  if (selectionType === 'multi') {
    return (
      <th
        className={clsx(className, selectionCellClass)}
        scope="col"
        ref={node => {
          if (node !== null) {
            stickyState.refs.headerCells.current[0] = node;
          }
          ref.current = node;
        }}
      >
        {children}
      </th>
    );
  } else {
    return (
      <th
        className={clsx(className, selectionCellClass)}
        scope="col"
        ref={node => {
          if (node !== null) {
            stickyState.refs.headerCells.current[0] = node;
          }
          ref.current = node;
        }}
      >
        {children}
      </th>
    );
  }
}

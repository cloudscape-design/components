// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import styles from '../styles.css.js';
import { selectionColumnId, StickyStateModel, useStickyStyles } from '../sticky-state-model';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import { TableProps } from '../interfaces';

interface TableBodySelectionCellProps {
  className?: string;
  selectionType?: TableProps.SelectionType;
  children: React.ReactNode;
  stickyState: StickyStateModel;
}

export function TableHeaderSelectionCell(props: TableBodySelectionCellProps) {
  const { children, selectionType, stickyState, className } = props;
  const stickyStyles = useStickyStyles({
    stickyState,
    columnId: selectionColumnId,
    getClassName: props => ({
      [styles['sticky-cell']]: !!props,
      [styles['sticky-cell-pad-left']]: !!props?.padLeft,
      [styles['sticky-cell-last-left']]: !!props?.lastLeft,
      [styles['sticky-cell-last-right']]: !!props?.lastRight,
    }),
  });
  const isVisualRefresh = useVisualRefresh();
  const selectionCellClass = clsx(
    className,
    styles['has-selection'],
    styles['selection-control'],
    styles['selection-control-header'],
    isVisualRefresh && styles['is-visual-refresh'],
    stickyStyles.className
  );

  if (selectionType === 'multi') {
    return (
      <th style={stickyStyles.style} className={selectionCellClass} scope="col" ref={stickyStyles.ref}>
        {children}
      </th>
    );
  } else if (selectionType === 'single') {
    return (
      <th style={stickyStyles.style} className={selectionCellClass} scope="col" ref={stickyStyles.ref}>
        {children}
      </th>
    );
  } else {
    return null;
  }
}

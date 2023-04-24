// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';
import styles from '../styles.css.js';

interface TableHeaderSelectionCellProps {
  className?: string;
  children: React.ReactNode;
}

export function TableHeaderSelectionCell({ children, className }: TableHeaderSelectionCellProps) {
  const isVisualRefresh = useVisualRefresh();
  const selectionCellClass = clsx(
    className,
    styles['has-selection'],
    styles['selection-control'],
    styles['selection-control-header'],
    isVisualRefresh && styles['is-visual-refresh']
  );

  return (
    <th className={selectionCellClass} scope="col">
      {children}
    </th>
  );
}

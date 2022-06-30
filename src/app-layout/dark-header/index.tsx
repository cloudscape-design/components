// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import styles from './styles.css.js';

export interface DarkHeaderProps {
  isMobile: boolean;
  toolsWidth: number;
  navigationWidth: number;
  children?: React.ReactNode;
  topOffset?: number;
  sticky?: boolean;
}

export function DarkHeader({ children, topOffset, sticky }: DarkHeaderProps) {
  return (
    <div
      className={clsx(styles['content-header'], sticky && styles['content-header-sticky'])}
      style={{ top: topOffset }}
    >
      {children}
    </div>
  );
}

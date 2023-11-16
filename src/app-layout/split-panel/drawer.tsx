// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import styles from './styles.css.js';
import { useSplitPanelContext } from '../../internal/context/split-panel-context';

interface SideSplitPanelDrawer {
  displayed: boolean;
  children: React.ReactNode;
}

export function SideSplitPanelDrawer({ displayed, children }: SideSplitPanelDrawer) {
  const { isOpen, size, topOffset, bottomOffset } = useSplitPanelContext();
  const width = isOpen && children ? size : undefined;
  return (
    <div
      className={clsx(displayed && styles['drawer-displayed'])}
      style={{ width }}
      data-testid="side-split-panel-drawer"
    >
      <div className={styles['drawer-content']} style={{ width: width, top: topOffset, bottom: bottomOffset }}>
        {children}
      </div>
    </div>
  );
}

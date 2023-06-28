// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import styles from './styles.css.js';

interface SideSplitPanelDrawer {
  topOffset: number | undefined;
  bottomOffset: number | undefined;
  width: number | undefined;
  displayed: boolean;
  children: React.ReactNode;
}

export function SideSplitPanelDrawer({ topOffset, bottomOffset, width, displayed, children }: SideSplitPanelDrawer) {
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

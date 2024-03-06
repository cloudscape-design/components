// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { useAppLayoutInternals } from '../context';
import styles from './styles.css.js';

export function SplitPanelSide() {
  const {
    isSplitPanelOpen,
    splitPanel,
    splitPanelPosition,
    splitPanelMaxWidth,
    splitPanelControlId,
    splitPanelSize,
    placement,
    isToolsOpen,
    activeDrawerId,
  } = useAppLayoutInternals();

  if (!splitPanel) {
    return null;
  }

  return (
    <section
      id={splitPanelControlId}
      className={clsx(styles.root, !isSplitPanelOpen && styles['panel-closed'])}
      style={{
        blockSize: `calc(100vh - ${placement.insetBlockStart}px - ${placement.insetBlockEnd}px)`,
        insetBlockStart: placement.insetBlockStart,
        inlineSize: isSplitPanelOpen ? splitPanelSize : undefined,
      }}
    >
      {splitPanel}
    </section>
  );
}

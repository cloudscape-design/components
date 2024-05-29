// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useAppLayoutInternals } from '../context';
import styles from './styles.css.js';

export function SideSplitPanelDrawer({ children }: { children: React.ReactNode }) {
  const { splitPanelControlId, placement } = useAppLayoutInternals();

  return (
    <section
      id={splitPanelControlId}
      className={styles.root}
      style={{
        blockSize: `calc(100vh - ${placement.insetBlockStart}px - ${placement.insetBlockEnd}px)`,
        insetBlockStart: placement.insetBlockStart,
      }}
    >
      {children}
    </section>
  );
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import styles from './styles.css.js';
import React from 'react';
import { useAppLayoutInternals } from '../context';
import { Transition } from '../../../internal/components/transition';
import customCssProps from '../../../internal/generated/custom-css-properties';

export function SplitPanelBottom() {
  const {
    disableBodyScroll,
    hasOpenDrawer,
    navigationOpen,
    isSplitPanelOpen,
    splitPanel,
    splitPanelPosition,
    splitPanelReportedSize,
    splitPanelReportedHeaderHeight,
    splitPanelSize,
    placement,
  } = useAppLayoutInternals();

  if (!splitPanel) {
    return null;
  }

  return (
    <section
      className={clsx(styles.root, !isSplitPanelOpen && styles['panel-closed'])}
      style={{
        insetBlockEnd: placement.insetBlockEnd,
        blockSize: isSplitPanelOpen ? splitPanelSize : undefined,
      }}
    >
      {splitPanel}
    </section>
  );
}

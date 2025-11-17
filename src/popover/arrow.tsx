// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { InternalPosition } from './interfaces';

import styles from './styles.css.js';

interface ArrowProps {
  position: InternalPosition | null;
  variant?: 'default' | 'info';
}

const Arrow = ({ position, variant }: ArrowProps) => {
  const isVisualRefresh = useVisualRefresh();
  return (
    <div className={clsx(styles.arrow, styles[`arrow-position-${position}`], styles[`arrow-variant-${variant}`])}>
      <div className={styles['arrow-outer']} />
      <div className={clsx(styles['arrow-inner'], isVisualRefresh && styles.refresh)} />
    </div>
  );
};

export default React.memo(Arrow);

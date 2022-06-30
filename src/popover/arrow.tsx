// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';
import { InternalPosition } from './interfaces';

export interface ArrowProps {
  position: InternalPosition | null;
}

const Arrow = (props: ArrowProps) => (
  <div className={clsx(styles.arrow, props.position && styles[`arrow-position-${props.position}`])}>
    <div className={styles['arrow-outer']} />
    <div className={styles['arrow-inner']} />
  </div>
);

export default React.memo(Arrow);

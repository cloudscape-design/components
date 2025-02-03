// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { InternalPosition } from './interfaces';

import styles from './styles.css.js';

interface ArrowProps {
  position: InternalPosition | null;
}

const Arrow = (props: ArrowProps) => {
  return (
    <div className={clsx(styles.arrow, props.position && styles[`arrow-position-${props.position}`])}>
      <div className={styles['arrow-outer']} />
      <div className={clsx(styles['arrow-inner'], styles.refresh)} />
    </div>
  );
};

export default React.memo(Arrow);

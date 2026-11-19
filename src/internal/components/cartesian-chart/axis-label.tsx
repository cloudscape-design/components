// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo } from 'react';
import clsx from 'clsx';

import InternalBox from '../../../box/internal';

import styles from './styles.css.js';

interface AxisLabelProps {
  title?: string;
  axis: 'x' | 'y';
  position: 'left' | 'bottom';
}

export default memo(AxisLabel) as typeof AxisLabel;

function AxisLabel({ title, axis, position }: AxisLabelProps) {
  if (!title) {
    return null;
  }

  return (
    <InternalBox
      className={clsx(styles['axis-label'], axis === 'x' ? styles['axis-label--x'] : styles['axis-label--y'])}
      fontWeight="bold"
      textAlign={position === 'left' ? 'left' : 'center'}
      margin={{ bottom: position === 'left' ? 'l' : 'n' }}
    >
      <span aria-hidden="true">{title}</span>
    </InternalBox>
  );
}

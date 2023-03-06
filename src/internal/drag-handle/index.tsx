// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ForwardedRef, forwardRef } from 'react';

import Handle from '../handle';
import DragHandleIcon from './icon';
import styles from './styles.css.js';

export interface DragHandleProps {
  ariaLabelledBy: string;
  ariaDescribedBy: string;
}

function DragHandle({ ariaLabelledBy, ariaDescribedBy }: DragHandleProps, ref: ForwardedRef<HTMLButtonElement>) {
  return (
    <Handle ref={ref} className={styles.handle} aria-labelledby={ariaLabelledBy} aria-describedby={ariaDescribedBy}>
      <DragHandleIcon />
    </Handle>
  );
}

export default forwardRef(DragHandle);

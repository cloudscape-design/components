// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { HTMLAttributes, ReactNode } from 'react';

import styles from './styles.css.js';

export default React.forwardRef<
  HTMLTableRowElement,
  {
    children?: ReactNode;
    nativeAttributes?: HTMLAttributes<HTMLTableRowElement>;
  }
>(function Row({ children, nativeAttributes }, ref) {
  return (
    <tr className={styles.row} {...nativeAttributes} ref={ref}>
      {children}
    </tr>
  );
});

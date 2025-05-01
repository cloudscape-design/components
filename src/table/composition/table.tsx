// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import styles from './styles.css.js';

export default React.forwardRef<
  HTMLTableElement,
  { children?: React.ReactNode; nativeAttributes?: React.HTMLAttributes<HTMLTableElement>; style?: React.CSSProperties }
>(function Table({ children, nativeAttributes, style }, ref) {
  return (
    <table className={styles.table} {...nativeAttributes} ref={ref} style={{ tableLayout: style?.tableLayout }}>
      {children}
    </table>
  );
});

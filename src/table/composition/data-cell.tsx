// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import styles from './styles.css.js';

export default function DataCell({ children, colSpan, truncate, textAlign }: any) {
  const truncateStyles = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  return (
    <td
      className={styles['data-cell']}
      colSpan={colSpan}
      style={{ textAlign: textAlign || 'inherit', ...(truncate && truncateStyles) }}
    >
      {children}
    </td>
  );
}

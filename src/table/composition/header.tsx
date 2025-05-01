// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import styles from './styles.css.js';

export default function Header({ children, textAlign, truncate }: any) {
  const truncateStyles = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  return (
    <th className={styles.header} style={{ textAlign: textAlign || 'inherit', ...(truncate && truncateStyles) }}>
      {children}
    </th>
  );
}

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import * as styles from './styles.module.scss';

interface SeparatedListProps {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  items: Array<React.ReactNode>;
}

export function SeparatedList({ ariaLabel, ariaLabelledBy, items }: SeparatedListProps) {
  return (
    <ul aria-label={ariaLabel} aria-labelledby={ariaLabelledBy} className={styles.root}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

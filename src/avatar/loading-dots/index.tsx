// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './styles.css.js';

interface LoadingDotsProps {
  ariaLabel?: string;
}

export default function LoadingDots({ ariaLabel }: LoadingDotsProps) {
  return (
    <div className={styles.root} aria-label={ariaLabel}>
      <div className={styles.typing}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </div>
  );
}

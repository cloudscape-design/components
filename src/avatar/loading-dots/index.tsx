// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styles from './styles.css.js';
import clsx from 'clsx';

interface LoadingDotsProps {
  color?: string;
}

export default function LoadingDots({ color }: LoadingDotsProps) {
  return (
    <div className={clsx(styles.root, { [styles['gen-ai']]: color === 'gen-ai' })}>
      <div className={styles.typing}>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
        <div className={styles.dot}></div>
      </div>
    </div>
  );
}

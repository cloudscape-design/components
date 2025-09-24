// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { BuiltInErrorBoundary } from '../error-boundary/internal';

import styles from './styles.css.js';

export function ErrorBoundaryMain({ children }: { children: React.ReactNode }) {
  return (
    <BuiltInErrorBoundary renderFallback={content => <div className={styles['error-boundary-wrapper']}>{content}</div>}>
      {children}
    </BuiltInErrorBoundary>
  );
}

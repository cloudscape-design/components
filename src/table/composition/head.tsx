// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import styles from './styles.css.js';

export default function Head({ children }: any) {
  return <thead className={styles.head}>{children}</thead>;
}

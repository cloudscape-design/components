// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Checkbox, { CheckboxProps } from '~components/checkbox';

import styles from './checkbox-filter.scss';

export function CheckboxFilter(props: CheckboxProps) {
  return (
    <div className={styles.pill}>
      <Checkbox {...props} classNames={{ control: styles['checkbox-control'], label: styles['checkbox-label'] }} />
    </div>
  );
}

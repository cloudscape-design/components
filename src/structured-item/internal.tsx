// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { StructuredItemProps } from './interfaces';

import styles from './styles.css.js';
import testClasses from './test-classes/styles.css.js';

export default function InternalStructuredItem({
  label,
  description,
  icon,
  actions,
  disableTypography,
  percentageWrapping,
  ...rest
}: StructuredItemProps) {
  const baseProps = getBaseProps(rest);

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, styles.root, testClasses.root, percentageWrapping && styles.percentage)}
    >
      <div className={clsx(styles.main, disableTypography || styles.typography)}>
        {icon && <div className={clsx(styles.icon, testClasses.icon)}>{icon}</div>}
        <div className={styles.content}>
          <div className={clsx(styles.label, testClasses.label)}>{label}</div>
          {description && <div className={clsx(styles.description, testClasses.description)}>{description}</div>}
        </div>
      </div>
      <div className={styles.actions}>{actions}</div>
    </div>
  );
}

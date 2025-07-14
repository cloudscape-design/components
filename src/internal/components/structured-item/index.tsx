// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { StructuredItemProps } from './interfaces.js';

import styles from './styles.css.js';
import testClasses from './test-classes/styles.css.js';

export { StructuredItemProps };

export default function InternalStructuredItem({
  content,
  icon,
  actions,
  secondaryContent,
  disablePaddings,
  wrapActions = true,
}: StructuredItemProps) {
  return (
    <div className={clsx(styles.root, testClasses.root, disablePaddings && styles['disable-paddings'])}>
      {icon && <div className={clsx(styles.icon, testClasses.icon)}>{icon}</div>}
      <div className={clsx(styles.main)}>
        <div className={clsx(styles['content-wrap'], wrapActions && styles['wrap-actions'])}>
          <div className={clsx(styles.content, testClasses.content)}>{content}</div>
          {actions && <div className={clsx(styles.actions, testClasses.actions)}>{actions}</div>}
        </div>
        {secondaryContent && <div className={clsx(styles.secondary, testClasses.secondary)}>{secondaryContent}</div>}
      </div>
    </div>
  );
}

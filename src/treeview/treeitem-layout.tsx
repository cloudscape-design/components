// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

const TreeItemLayout = ({
  icon,
  content,
  secondaryContent,
  actions,
}: {
  icon?: React.ReactNode;
  content: React.ReactNode;
  secondaryContent?: React.ReactNode;
  actions?: React.ReactNode;
}) => {
  return (
    <div className={styles['treeitem-layout']}>
      <div className={styles['treeitem-first-line']}>
        {icon && <div className={testUtilStyles.icon}>{icon}</div>}

        <div className={clsx(styles.content, testUtilStyles.content)}>{content}</div>

        {actions && <div className={clsx(styles.actions, testUtilStyles.actions)}>{actions}</div>}
      </div>

      {secondaryContent && (
        <div className={clsx(styles['secondary-content'], testUtilStyles['secondary-content'])}>{secondaryContent}</div>
      )}
    </div>
  );
};

export default TreeItemLayout;

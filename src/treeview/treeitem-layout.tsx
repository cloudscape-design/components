// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import styles from './styles.css.js';

const TreeItemLayout = ({
  icon,
  content,
  description,
  secondaryContent,
}: {
  icon?: React.ReactNode;
  content: React.ReactNode;
  description?: React.ReactNode;
  secondaryContent?: React.ReactNode;
}) => {
  return (
    <div className={styles['treeitem-layout']}>
      <div className={styles['treeitem-first-line']}>
        {icon && <div className={styles['treeitem-icon']}>{icon}</div>}

        <div className={styles['treeitem-content']}>{content}</div>

        {secondaryContent && <div className={styles['treeitem-secondary-content']}>{secondaryContent}</div>}
      </div>

      {description && <div className={styles['treeitem-description']}>{description}</div>}
    </div>
  );
};

export default TreeItemLayout;

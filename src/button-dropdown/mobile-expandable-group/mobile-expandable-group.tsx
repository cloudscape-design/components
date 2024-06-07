// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import styles from './styles.css.js';

export interface MobileExpandableGroupProps {
  /**
   * Trigger element.
   */
  trigger: React.ReactNode;
  /**
   * mobile expandable groups content elements.
   */
  children?: React.ReactNode;
  /**
   * Open state of the mobile expandable groups.
   */
  open?: boolean;
}

const MobileExpandableGroup = ({ children, trigger, open }: MobileExpandableGroupProps) => {
  return (
    <div className={styles.root}>
      <div className={styles.trigger}>{trigger}</div>
      <div className={clsx(styles.dropdown, { [styles.open]: open })} data-open={open}>
        {children}
      </div>
    </div>
  );
};

export default MobileExpandableGroup;

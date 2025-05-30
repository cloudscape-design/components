// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

const Connector = ({
  level,
  position,
  isExpandable,
}: {
  level: number;
  position: 'start' | 'middle' | 'end';
  isExpandable: boolean;
}) => {
  if (level === 0) {
    return (
      <div
        className={clsx(
          styles['treeitem-connector-vertical-root'],
          position === 'end' && styles['treeitem-connector-vertical-root-end'],
          isExpandable && styles['treeitem-connector-vertical-expandable']
        )}
      ></div>
    );
  }

  return (
    <>
      <div className={clsx(styles['treeitem-connector-horizontal'], isExpandable && [styles.expandable])}></div>

      {level > 1 && (position === 'start' || position === 'end') && (
        <div className={styles['treeitem-connector-vertical-end']}></div>
      )}

      {level > 1 && position === 'middle' && <div className={styles['treeitem-connector-vertical-middle']}></div>}
    </>
  );
};

export default Connector;

// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';

const Connector = ({
  level,
  position,
  isExpandable,
  isExpanded,
}: {
  level: number;
  position: 'start' | 'middle' | 'end';
  isExpandable: boolean;
  isExpanded: boolean;
}) => {
  if (level === 0) {
    return (
      <div className={styles.connector}>
        <div
          className={clsx(
            styles['vertical-rule-level-0'],
            isExpandable && styles.expandable,
            styles[`position-${position}`]
          )}
        />

        {!isExpandable && <div className={clsx(styles['horizontal-rule-level-0'])} />}
      </div>
    );
  }

  return (
    <div className={styles.connector}>
      <div className={clsx(styles['horizontal-rule'], isExpandable && styles.expandable)} />

      {level > 0 &&
        Array.from(Array(level + 1).keys()).map(l => {
          if (l === 0) {
            const offsetLevelDiff = level - 1;
            return (
              <div
                key={`${level} - ${l}`}
                className={clsx(styles['vertical-rule'], styles[`with-offset-${offsetLevelDiff}`])}
              />
            );
          }

          // No vertical lines shown if item is not expanded
          if (l === level && !isExpanded) {
            return <div key={`${level} - ${l}`} />;
          }

          const offsetLevelDiff = level - l - 1;

          return (
            <div
              key={`${level} - ${l}`}
              className={clsx(
                styles['vertical-rule'],
                l !== level && styles[`position-${position}`],
                isExpanded && l === level && styles.expanded,
                styles[`with-offset-${offsetLevelDiff}`]
              )}
            />
          );
        })}
    </div>
  );
};

export default Connector;

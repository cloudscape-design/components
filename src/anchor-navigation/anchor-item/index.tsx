// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback } from 'react';
import clsx from 'clsx';

import { isPlainLeftClick } from '../../internal/events';
import { checkSafeUrl } from '../../internal/utils/check-safe-url';
import { AnchorNavigationProps } from '../interfaces';

import styles from '../styles.css.js';
import testUtilsStyles from '../test-classes/styles.css.js';

interface AnchorItemProps {
  anchor: AnchorNavigationProps.Anchor;
  onFollow: (anchor: AnchorNavigationProps.Anchor, event: React.SyntheticEvent | Event) => void;
  isActive: boolean;
  index: number;
  children: React.ReactNode;
}

export const AnchorItem = ({ anchor, onFollow, isActive, index, children }: AnchorItemProps) => {
  checkSafeUrl('AnchorNavigation', anchor.href);

  const onClick = useCallback(
    (event: React.MouseEvent) => {
      if (isPlainLeftClick(event)) {
        onFollow(anchor, event);
      }
    },
    [onFollow, anchor]
  );

  const activeItemClasses = clsx(styles['anchor-item--active'], testUtilsStyles['anchor-item--active']);

  return (
    <li data-itemid={`anchor-item-${index + 1}`} className={clsx(styles['anchor-item'], isActive && activeItemClasses)}>
      <a
        onClick={onClick}
        className={clsx(
          styles['anchor-link'],
          testUtilsStyles['anchor-link'],
          isActive && styles['anchor-link--active']
        )}
        {...(isActive ? { 'aria-current': true } : {})}
        href={anchor.href}
      >
        <span
          className={clsx(styles['anchor-link-text'], testUtilsStyles['anchor-link-text'])}
          style={{ paddingInlineStart: `${anchor.level * 16 + 2}px` }}
        >
          {anchor.text}
        </span>
        {anchor.info && (
          <span className={clsx(styles['anchor-link-info'], testUtilsStyles['anchor-link-info'])}>{anchor.info}</span>
        )}
      </a>
      {children}
    </li>
  );
};

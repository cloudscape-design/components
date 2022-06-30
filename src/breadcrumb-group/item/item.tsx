// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { BreadcrumbGroupProps, BreadcrumbItemProps } from '../interfaces';
import InternalIcon from '../../icon/internal';
import styles from './styles.css.js';
import clsx from 'clsx';
import useFocusVisible from '../../internal/hooks/focus-visible';
import { fireCancelableEvent, isPlainLeftClick } from '../../internal/events';
import { getEventDetail } from '../internal';

export function BreadcrumbItem<T extends BreadcrumbGroupProps.Item>({
  item,
  onClick,
  onFollow,
  isLast = false,
  isCompressed = false,
}: BreadcrumbItemProps<T>) {
  const focusVisible = useFocusVisible();
  const preventDefault = (event: React.MouseEvent) => event.preventDefault();
  const onClickHandler = (event: React.MouseEvent) => {
    if (isPlainLeftClick(event)) {
      fireCancelableEvent(onFollow, getEventDetail(item), event);
    }
    fireCancelableEvent(onClick, getEventDetail(item), event);
  };
  return (
    <div className={clsx(styles.breadcrumb, isLast && styles.last)}>
      <a
        {...focusVisible}
        href={item.href || '#'}
        className={clsx(styles.anchor, { [styles.compressed]: isCompressed })}
        aria-current={isLast ? 'page' : undefined} // Active breadcrumb item is implemented according to WAI-ARIA 1.1
        aria-disabled={isLast && 'true'}
        onClick={isLast ? preventDefault : onClickHandler}
      >
        <span className={styles.text}>{item.text}</span>
      </a>
      {!isLast ? (
        <span className={styles.icon}>
          <InternalIcon name="angle-right" />
        </span>
      ) : null}
    </div>
  );
}
